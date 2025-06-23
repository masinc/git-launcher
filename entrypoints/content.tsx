import { parseRepoUrl } from './lib/urlParser';

export default defineContentScript({
  matches: [
    '*://github.com/*'
  ],
  async main() {
    const repoInfo = parseRepoUrl(window.location.href);
    if (!repoInfo) return;

    console.log('GitHub Launcher: Repository detected', repoInfo);
  },
});
