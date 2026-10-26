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
    if (!targetUrl.hostname.endsWith("sportsonnline.click")) {
      return new Response("Host not allowed", { status: 403 });
    }

    const resp = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://ww1.sportsonnline.click/",
      },
    });
    const ct = resp.headers.get("content-type") || "text/html";
    if (!ct.includes("text/html")) {
      return new Response(resp.body, { headers: { "content-type": ct, "access-control-allow-origin": "*" } });
    }
    let html = await resp.text();
    const inject = `<style>
#html1,#button1,.ads,div[id^="ad"]{display:none!important}
</style>
<script>
try{document.querySelectorAll('#html1,#button1').forEach(e=>e.remove());}catch(e){}
</script>`;
    if (html.includes("</head>")) {
      html = html.replace("</head>", inject + "</head>");
    } else {
      html = inject + html;
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