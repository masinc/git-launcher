import { useState, useEffect } from "react";
import { getEnabledTools, buildToolUrl, type Tool } from "../lib/settings";
import { parseRepoUrl, type RepoInfo } from "../lib/urlParser";

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // Get current tab URL and tools
    Promise.all([
      browser.tabs.query({ active: true, currentWindow: true }),
      getEnabledTools(),
    ]).then(([tabs, enabledTools]) => {
      const tab = tabs[0];
      if (tab?.url) {
        setCurrentUrl(tab.url);
        const repo = parseRepoUrl(tab.url);
        setRepoInfo(repo);
      }
      setTools(enabledTools);
    });
  }, []);

  const handleToolClick = (tool: Tool) => {
    if (!repoInfo) return;
    const url = buildToolUrl(tool, repoInfo.owner, repoInfo.repo);
    browser.tabs.create({ url });
    window.close(); // Close popup after opening tool
  };

  const openSettings = () => {
    const url = browser.runtime.getURL("/options.html");
    console.log("Opening settings URL:", url);
    browser.tabs.create({ url });
    window.close();
  };

  return (
    <div className="w-80 p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">GitHub Launcher</h1>
        <button
          type="button"
          onClick={openSettings}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          title="Settings"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Settings"
          >
            <title>Settings</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {repoInfo ? (
        <div>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">
              Current Repository
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {repoInfo.owner}/{repoInfo.repo}
            </div>
          </div>

          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                type="button"
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900">
                  Open with {tool.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {tool.urlTemplate}
                </div>
              </button>
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No tools enabled. Click settings to configure.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            📍 Navigate to a GitHub repository to use this extension
          </div>
          <div className="text-sm text-gray-400">
            Current page:{" "}
            {currentUrl ? new URL(currentUrl).hostname : "Unknown"}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
