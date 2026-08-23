import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,

  modules: ["@nuxt/fonts", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],

  fonts: {
    provider: "npm",
    npm: {
      remote: false,
    },
    families: [
      {
        name: "Inter Variable",
        provider: "npm",
        providerOptions: {
          npm: { package: "@fontsource-variable/inter", file: "wght.css" },
        },
        weights: [100, 900],
        styles: ["normal"],
        global: true,
      },
      {
        name: "JetBrains Mono Variable",
        provider: "npm",
        providerOptions: {
          npm: { package: "@fontsource-variable/jetbrains-mono", file: "wght.css" },
        },
        weights: [100, 800],
        styles: ["normal"],
        global: true,
      },
    ],
    defaults: {
      formats: ["woff2"],
      subsets: ["latin"],
    },
  },

  icon: {
    provider: "none",
    serverBundle: false,
    clientBundle: {
      scan: true,
      icons: [
        "lucide:check",
        "lucide:clipboard",
        "lucide:download",
        "lucide:hash",
        "lucide:image",
        "lucide:loader-circle",
        "lucide:rotate-ccw",
        "lucide:share-2",
        "lucide:upload",
      ],
      sizeLimitKb: 32,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
  nitro: {
    preset: "static",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", href: "/favicon.ico" }],
    },
  },
});
