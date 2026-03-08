// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    uploadToken: "", // Set via NUXT_UPLOAD_TOKEN env var
  },

  app: {
    head: {
      title: "filedrop",
      titleTemplate: "%s",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: process.env.APP_NAME,
        main: "./index.mjs",
        compatibility_date: "2025-07-15",
        vars: {
          NUXT_UPLOAD_TOKEN: process.env.NUXT_UPLOAD_TOKEN || "",
        },
        r2_buckets: [
          {
            binding: "BUCKET",
            bucket_name: process.env.R2_BUCKET_NAME || "filedrop",
          },
        ],
      },
    },
  },

  $production: {
  nitro: {
      preset: "cloudflare-module",
    },
  },
});
