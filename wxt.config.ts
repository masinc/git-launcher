import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  runner: {
    startUrls: ['https://github.com/axios/axios'],
  },
  manifest: {
    name: 'GitHub Launcher',
    description: 'Open GitHub repositories in GitIngest, Deepwiki and other tools',
    permissions: ['storage', 'contextMenus'],
    host_permissions: [
      'https://github.com/*'
    ]
  }
});
