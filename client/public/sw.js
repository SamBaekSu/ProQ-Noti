if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>n(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(t.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"9727ba06faf272f0d31a1aff4e92f311"},{url:"/_next/static/chunks/433-9761da1e55209148.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/4bd1b696-78608d083ecb8459.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/517-c43ea7e0660477c0.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/527-d98f70be71f44a24.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/_not-found/page-1c7c769691660379.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/account/route-10134fe255486472.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/auth/callback/kakao/route-baef56dec8f18381.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/auth/login/page-6ce2ed4ae6d5df3b.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/dashboard/page-952ecaa33276bee9.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/layout-e1f0b72e25bd7cfc.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/page-3a4ece121f14dc3a.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/puuid/route-49cfe7121d98ff02.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/app/register/route-705a2af4cfe77a5b.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/main-5721bfbdacbb7e6d.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/main-app-fdd2f2238b29a82c.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-9edee2920554d0a5.js",revision:"m88n-FE7fnVzhrUePebsg"},{url:"/_next/static/css/c197564695033b96.css",revision:"c197564695033b96"},{url:"/_next/static/m88n-FE7fnVzhrUePebsg/_buildManifest.js",revision:"da53b53f4f2d745b36f25d65fbf4ea64"},{url:"/_next/static/m88n-FE7fnVzhrUePebsg/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/manifest.json",revision:"b946edf26d665c06b7859f9040ad1b59"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
