import { writeFileSync } from "node:fs";

const URL = "https://sportsonline.st/";
const res = await fetch(URL, { headers: { "User-Agent": "stream-grid-updater" } });
if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
const text = await res.text();

const lines = text.split(/\r?\n/);
const raw = [];
const re = /^\s*(\d{1,2}:\d{2})\s+(.+?)\s*\|\s*(https?:\/\/\S+?)(?:<br\s*\/?>|\s)*$/i;
for (const line of lines) {
  const m = line.match(re);
  if (!m) continue;
  const [, time, title, url] = m;
  raw.push({
    time,
    title: title.replace(/<[^>]*>/g, "").trim(),
    url: url.replace(/<.*$/, "").trim(),
  });
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function groupOf(url) {
  const parts = url.split("/channels/");
  if (parts[1]) return parts[1].split("/")[0];
  return "other";
}

async function resolvePlayer(wrapperUrl) {
  try {
    const res = await fetch(wrapperUrl, { headers: { "User-Agent": "stream-grid-updater" } });
    if (!res.ok) return wrapperUrl;
    const html = await res.text();
    const m = html.match(/<iframe[^>]*src=["']([^"']+)["']/i);
    if (m && m[1]) return m[1].trim();
    return wrapperUrl;
  } catch {
    return wrapperUrl;
  }
}

const map = new Map();
for (const r of raw) {
  if (!map.has(r.url)) {
    const playerUrl = await resolvePlayer(r.url);
    map.set(r.url, {
      id: `${slugify(r.title)}-${slugify(r.url.split("/").pop() ?? r.url)}`,
      title: r.title,
      time: r.time,
      url: playerUrl,
      group: groupOf(r.url),
    });
  }
}
const streams = Array.from(map.values());
const groups = Array.from(new Set(streams.map((s) => s.group).filter(Boolean)));

const content = `export type StreamItem = {
  id: string;
  title: string;
  time?: string;
  url: string;
  group?: string;
};

export const streams: StreamItem[] = ${JSON.stringify(streams, null, 2)};

export const groups: string[] = ${JSON.stringify(groups, null, 2)};
`;

writeFileSync("src/data/streams.ts", content, "utf-8");
console.log(`Updated ${streams.length} unique streams from ${raw.length} entries.`);