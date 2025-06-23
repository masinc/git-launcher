export interface Tool {
  id: string;
  name: string;
  urlTemplate: string;
  enabled: boolean;
}

export interface Settings {
  tools: Tool[];
  showInContextMenu: boolean;
}

const DEFAULT_TOOLS: Tool[] = [
  {
    id: 'gitingest',
    name: 'GitIngest',
    urlTemplate: 'https://gitingest.com/{owner}/{repo}',
    enabled: true
  },
  {
    id: 'deepwiki',
    name: 'Deepwiki',
    urlTemplate: 'https://deepwiki.com/{owner}/{repo}',
    enabled: true
  }
];

const DEFAULT_SETTINGS: Settings = {
  tools: DEFAULT_TOOLS,
  showInContextMenu: true
};

export async function getSettings(): Promise<Settings> {
  const result = await browser.storage.sync.get('settings');
  return result.settings || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.sync.set({ settings });
}

export async function getEnabledTools(): Promise<Tool[]> {
  const settings = await getSettings();
  return settings.tools.filter(tool => tool.enabled);
}

export function buildToolUrl(tool: Tool, owner: string, repo: string): string {
  return tool.urlTemplate
    .replace('{owner}', owner)
    .replace('{repo}', repo);
}