const ALLOWED = (host) =>
  host.endsWith("sportsonnline.click") ||
  host.endsWith("dynmeadow.net") ||
  host.endsWith("tossequip.net") ||
  host.endsWith("sportsonline.website");

function proxify(workerBase, target) {
  return `${workerBase}/?u=${encodeURIComponent(target)}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = url.searchParams.get("u");
    if (!target) {
      return new Response("Missing ?u=", { status: 400 });
    }
    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Bad url", { status: 400 });
    }
    if (!ALLOWED(targetUrl.hostname)) {
      return new Response("Host not allowed", { status: 403 });
    }

    const workerBase = `${url.protocol}//${url.host}`;
    const resp = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://ww1.sportsonnline.click/",
      },
    });
    const ct = resp.headers.get("content-type") || "text/html";
    if (!ct.includes("text/html")) {
      return new Response(resp.body, {
        headers: { "content-type": ct, "access-control-allow-origin": "*" },
      });
    }
    let html = await resp.text();

    const isWrapper = targetUrl.hostname.endsWith("sportsonnline.click");

    if (isWrapper) {
      // Hide ad overlays
      const css = `<style>
#html1,#button1,.ads,div[id^="ad"]{display:none!important}
</style>`;
      if (html.includes("</head>")) html = html.replace("</head>", css + "</head>");
      else html = css + html;

      // Rewrite nested player iframe src to proxied player URL
      html = html.replace(
        /(<iframe[^>]*src=["'])([^"']+)(["'][^>]*>)/gi,
        (match, pre, src, post) => {
          if (!src) return match;
          if (src.includes("sportsonnline.click")) return match; // keep wrappers if any
          return `${pre}${proxify(workerBase, src)}${post}`;
        }
      );
    } else {
      // Player page: override document.referrer to satisfy domain protection
      const script = `<script>
try { Object.defineProperty(document, "referrer", { value: "https://ww1.sportsonnline.click/", configurable: true }); } catch (e) {}
</script>`;
      if (html.includes("</head>")) html = html.replace("</head>", script + "</head>");
      else html = script + html;
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "access-control-allow-origin": "*",
        "x-frame-options": "ALLOWALL",
      },
    });
  },
};