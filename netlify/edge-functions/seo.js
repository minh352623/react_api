
export default async (request, context) => {
    console.log("🚀 ~ file: seo.js:3 ~ request:", request)
    const url = new URL(request.url)
    console.log("🚀 ~ file: seo.js:5 ~ url:", url)
    
    // Get the page content.
    const response = await context.next()
    console.log("🚀 ~ file: seo.js:8 ~ response:", response)
    const page = await response.text()
    console.log("🚀 ~ file: seo.js:10 ~ page:", page)
    return  new Response(`<!DOCTYPE html>
    <html>
       <head>
          <base href="/" />
          <title>ProArt Display PA279CRV|Monitors|ASUS Global| Content From Server </title>
          <meta data-n-head="ssr" charset="utf-8" />
          <meta
             data-n-head="ssr"
             name="viewport"
             content="width=device-width, initial-scale=1, maximum-scale=5.0"
          />
          <meta
             data-n-head="ssr"
             data-hid="description"
             name="description"
             content="ASUS ProArt Display PA279CRV is a 4K HDR USB-C monitor with 99% DCI-P3 designed for video editors, photographers, graphic designers, and creative professionals."
          />
          <meta data-n-head="ssr" data-hid="og:title" property="og:title" content="" />
          <meta data-n-head="ssr" data-hid="og:type" property="og:type" content="website" />
          <meta
             data-n-head="ssr"
             data-hid="og:site_name"
             property="og:site_name"
             content="ASUS Global"
          />
          <meta
             data-n-head="ssr"
             data-hid="og:description"
             property="og:description"
             content="The goal of the ASUS ProArt display series is to offer the most advanced technologies to power the imaginations of creators everywhere. With features such as mini-LED backlights, OLED displays, and ASUS Smart HDR technology, ProArt monitors are the solution for creating masterpieces."
          />
          <meta
             data-n-head="ssr"
             data-hid="og:url"
             property="og:url"
             content="https://www.asus.com/displays-desktops/monitors/proart/proart-display-pa279crv/"
          />
          <meta
             data-n-head="ssr"
             data-hid="og:image"
             property="og:image"
             content="https://dlcdnwebimgs.asus.com/gain/fb93a041-490f-4686-ac17-0ee6234fd66f/"
          />
          <meta
             data-n-head="ssr"
             data-hid="twitter:title"
             property="twitter:title"
             content=""
          />
          <meta
             data-n-head="ssr"
             data-hid="twitter:site"
             property="twitter:site"
             content="@ASUS"
          />
          <meta
             data-n-head="ssr"
             data-hid="twitter:description"
             property="twitter:description"
             content="The goal of the ASUS ProArt display series is to offer the most advanced technologies to power the imaginations of creators everywhere. With features such as mini-LED backlights, OLED displays, and ASUS Smart HDR technology, ProArt monitors are the solution for creating masterpieces."
          />
          <meta
             data-n-head="ssr"
             data-hid="twitter:card"
             property="twitter:card"
             content="summary_large_image"
          />
          <meta
             data-n-head="ssr"
             data-hid="twitter:image"
             property="twitter:image"
             content=""
          />
          <link
             data-n-head="ssr"
             rel="canonical"
             href="https://www.asus.com/displays-desktops/monitors/proart/proart-display-pa279crv/"
          />

          <link rel="manifest" href="manifest.json" />
       </head>
       <body>
          <script>
             if ('serviceWorker' in navigator) {
                window.addEventListener('flutter-first-frame', function () {
                   navigator.serviceWorker.register('flutter_service_worker.js?v=2038868271');
                });
             }
          </script>

          <script src="main.dart.js" type="application/javascript"></script>
       </body>
    </html>`,response)
   
};

export const config = {
  path: "/seo/*",
};