import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  webExt: {
    startUrls: ["https://github.com/axios/axios"],
  },
  manifest: {
    name: "GitHub Launcher",
    description:
      "Open GitHub repositories in GitIngest, Deepwiki and other tools",
    permissions: ["storage", "contextMenus", "activeTab"],
    host_permissions: ["https://github.com/*"],
    icons: {
      16: "/icon/icon16.png",
      32: "/icon/icon32.png",
      48: "/icon/icon48.png",
      128: "/icon/icon128.png",
    },
  },
});
