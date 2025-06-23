import { parseRepoUrl } from './lib/urlParser';
import { getSettings, getEnabledTools, buildToolUrl } from './lib/settings';

export default defineBackground(() => {
  console.log('GitHub Launcher background script loaded');


  // Create context menu
  browser.runtime.onInstalled.addListener(async () => {
    const settings = await getSettings();
    if (settings.showInContextMenu) {
      createContextMenu();
    }
  });

  // Update context menu when settings change
  browser.storage.onChanged.addListener(async (changes) => {
    if (changes.settings) {
      const newSettings = changes.settings.newValue;
      if (newSettings.showInContextMenu) {
        createContextMenu();
      } else {
        browser.contextMenus.removeAll();
      }
    }
  });

  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.url || !info.menuItemId) return;

    const repoInfo = parseRepoUrl(tab.url);
    if (!repoInfo) return;

    const tools = await getEnabledTools();
    const tool = tools.find(t => t.id === info.menuItemId);
    if (!tool) return;

    const url = buildToolUrl(tool, repoInfo.owner, repoInfo.repo);
    browser.tabs.create({ url });
  });
});

async function createContextMenu() {
  await browser.contextMenus.removeAll();

  const tools = await getEnabledTools();
  
  if (tools.length === 0) return;

  // Create parent menu
  browser.contextMenus.create({
    id: 'git-launcher',
    title: 'Open with GitHub Launcher',
    contexts: ['page'],
    documentUrlPatterns: [
      '*://github.com/*'
    ]
  });

  // Create submenu for each tool
  tools.forEach(tool => {
    browser.contextMenus.create({
      id: tool.id,
      parentId: 'git-launcher',
      title: tool.name,
      contexts: ['page'],
      documentUrlPatterns: [
        '*://github.com/*',
        '*://gitlab.com/*',
        '*://bitbucket.org/*'
      ]
    });
  });
}
