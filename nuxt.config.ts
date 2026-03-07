// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Open Formation WebApp",
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
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: "cloudflare-d1",
        options: {
          bindingName: "DB",
        },
      },
    },
    devDatabase: {
      default: {
        connector: "sqlite",
        options: {
          name: "app",
        },
      },
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: process.env.APP_NAME,
        main: "./index.mjs",
        compatibility_date: "2025-07-15",
        d1_databases: [
          {
            binding: "DB",
            database_name: process.env.D1_DATABASE_NAME,
            database_id: process.env.D1_DATABASE_ID,
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