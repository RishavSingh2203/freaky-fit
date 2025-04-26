// vite.config.ts
import path from "path";
import tailwindcss from "file:///D:/Freaky%20Fit/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///D:/Freaky%20Fit/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///D:/Freaky%20Fit/frontend/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///D:/Freaky%20Fit/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "D:\\Freaky Fit\\frontend";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.svg", "masked-icon.svg"],
        manifest: {
          name: "BodyMind AI - AI Powered Fitness",
          short_name: "BodyMind AI",
          description: "AI-powered fitness app for personalized workouts and meal plans",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          scope: "/",
          start_url: "/",
          orientation: "portrait",
          icons: [
            {
              src: "/pwa-icons/icon-192x192.svg",
              sizes: "192x192",
              type: "image/svg+xml",
              purpose: "any"
            },
            {
              src: "/pwa-icons/icon-512x512.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "any"
            },
            {
              src: "/pwa-icons/icon-maskable-512x512.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "maskable"
            }
          ]
        },
        workbox: {
          // Disable navigation preload
          navigationPreload: false,
          // Cache strategies only for static assets
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                  // 1 year
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                  // 1 year
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                  // 30 days
                }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxGcmVha3kgRml0XFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxGcmVha3kgRml0XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9GcmVha3klMjBGaXQvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIlxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52IGZpbGUgYmFzZWQgb24gYG1vZGVgIGluIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksIFxuICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICAgIFZpdGVQV0Eoe1xuICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdhcHBsZS10b3VjaC1pY29uLnN2ZycsICdtYXNrZWQtaWNvbi5zdmcnXSxcbiAgICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgICBuYW1lOiAnQm9keU1pbmQgQUkgLSBBSSBQb3dlcmVkIEZpdG5lc3MnLFxuICAgICAgICAgIHNob3J0X25hbWU6ICdCb2R5TWluZCBBSScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBSS1wb3dlcmVkIGZpdG5lc3MgYXBwIGZvciBwZXJzb25hbGl6ZWQgd29ya291dHMgYW5kIG1lYWwgcGxhbnMnLFxuICAgICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJy9wd2EtaWNvbnMvaWNvbi0xOTJ4MTkyLnN2ZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJy9wd2EtaWNvbnMvaWNvbi01MTJ4NTEyLnN2ZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJy9wd2EtaWNvbnMvaWNvbi1tYXNrYWJsZS01MTJ4NTEyLnN2ZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgd29ya2JveDoge1xuICAgICAgICAgIC8vIERpc2FibGUgbmF2aWdhdGlvbiBwcmVsb2FkXG4gICAgICAgICAgbmF2aWdhdGlvblByZWxvYWQ6IGZhbHNlLFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIENhY2hlIHN0cmF0ZWdpZXMgb25seSBmb3Igc3RhdGljIGFzc2V0c1xuICAgICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nb29nbGVhcGlzXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLWNhY2hlJyxcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSAvLyAxIHllYXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ3N0YXRpYy1mb250cy1jYWNoZScsXG4gICAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUgLy8gMSB5ZWFyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXFwuKD86cG5nfGpwZ3xqcGVnfHN2Z3xnaWYpJC9pLFxuICAgICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdpbWFnZXMtY2FjaGUnLFxuICAgICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzAgLy8gMzAgZGF5c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjUwMDAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59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
