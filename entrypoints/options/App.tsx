import { useState, useEffect } from "react";
import {
  type Settings,
  type Tool,
  getSettings,
  saveSettings,
} from "../lib/settings";

function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newToolName, setNewToolName] = useState("");
  const [newToolUrl, setNewToolUrl] = useState("");

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleToggleTool = async (toolId: string) => {
    if (!settings) return;

    const updatedTools = settings.tools.map((tool) =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool,
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
      enabled: true,
    };

    const newSettings = {
      ...settings,
      tools: [...settings.tools, newTool],
    };

    setSettings(newSettings);
    await saveSettings(newSettings);
    setNewToolName("");
    setNewToolUrl("");
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      tools: settings.tools.filter((tool) => tool.id !== toolId),
    };

    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleToggleContextMenu = async () => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      showInContextMenu: !settings.showInContextMenu,
    };

    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  if (!settings) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <div className="text-center mt-4 text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white min-h-screen">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <img src="/icon.svg" alt="GitHub Launcher" className="w-12 h-12 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            GitHub Launcher Settings
          </h1>
        </div>
        <p className="text-gray-600">
          Configure tools and options for the GitHub Launcher extension.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tools</h2>
        <div className="space-y-3">
          {settings.tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={tool.enabled}
                onChange={() => handleToggleTool(tool.id)}
                className="mr-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{tool.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {tool.urlTemplate}
                </div>
              </div>
              {!["gitingest", "deepwiki"].includes(tool.id) && (
                <button
                  type="button"
                  onClick={() => handleDeleteTool(tool.id)}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add Custom Tool
        </h2>
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Tool name"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="URL template (use {owner} and {repo})"
            value={newToolUrl}
            onChange={(e) => setNewToolUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="text-sm text-gray-500 mb-2">
            Example:{" "}
            <code className="bg-gray-200 px-1 rounded">
              https://example.com/repo/{"{owner}"}/{"{repo}"}
            </code>
          </div>
          <button
            type="button"
            onClick={handleAddTool}
            disabled={!newToolName || !newToolUrl}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Tool
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Options</h2>
        <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={settings.showInContextMenu}
            onChange={handleToggleContextMenu}
            className="mr-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-medium text-gray-900">
              Show in context menu
            </div>
            <div className="text-sm text-gray-500">
              Enable right-click menu on GitHub pages
            </div>
          </div>
        </label>
      </section>
    </div>
  );
}

export default App;
