import { useState, useEffect } from 'react';
import { Settings, Tool, getSettings, saveSettings } from '../lib/settings';

function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleToggleTool = async (toolId: string) => {
    if (!settings) return;
    
    const updatedTools = settings.tools.map(tool =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    );
    
    const newSettings = { ...settings, tools: updatedTools };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleAddTool = async () => {
    if (!settings || !newToolName || !newToolUrl) return;
    
    const newTool: Tool = {
      id: Date.now().toString(),
      name: newToolName,
      urlTemplate: newToolUrl,
      enabled: true
    };
    
    const newSettings = {
      ...settings,
      tools: [...settings.tools, newTool]
    };
    
    setSettings(newSettings);
    await saveSettings(newSettings);
    setNewToolName('');
    setNewToolUrl('');
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      tools: settings.tools.filter(tool => tool.id !== toolId)
    };
    
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleToggleContextMenu = async () => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      showInContextMenu: !settings.showInContextMenu
    };
    
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-96 p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">GitHub Launcher</h1>
      
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Tools</h2>
        {settings.tools.map(tool => (
          <div key={tool.id} className="flex items-center mb-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={tool.enabled}
              onChange={() => handleToggleTool(tool.id)}
              className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{tool.name}</div>
              <div className="text-xs text-gray-500">{tool.urlTemplate}</div>
            </div>
            {!['gitingest', 'deepwiki'].includes(tool.id) && (
              <button
                onClick={() => handleDeleteTool(tool.id)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Add Custom Tool</h2>
        <input
          type="text"
          placeholder="Tool name"
          value={newToolName}
          onChange={(e) => setNewToolName(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="URL template (use {owner} and {repo})"
          value={newToolUrl}
          onChange={(e) => setNewToolUrl(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={handleAddTool}
          disabled={!newToolName || !newToolUrl}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Tool
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Options</h2>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showInContextMenu}
            onChange={handleToggleContextMenu}
            className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">Show in context menu</span>
        </label>
      </section>
    </div>
  );
}

export default App;
