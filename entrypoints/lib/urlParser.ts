export interface RepoInfo {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
}

export function parseGitHubUrl(url: string): RepoInfo | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const repoName = repo.replace(/\.git$/, '');
  
  // Extract branch and path if present
  const branchMatch = url.match(/\/tree\/([^\/]+)(\/(.*))?/);
  const branch = branchMatch?.[1];
  const path = branchMatch?.[3];

  return { owner, repo: repoName, branch, path };
}

export function parseGitLabUrl(url: string): RepoInfo | null {
  const match = url.match(/gitlab\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const repoName = repo.replace(/\.git$/, '');
  
  const branchMatch = url.match(/\/-\/tree\/([^\/]+)(\/(.*))?/);
  const branch = branchMatch?.[1];
  const path = branchMatch?.[3];

  return { owner, repo: repoName, branch, path };
}

export function parseBitbucketUrl(url: string): RepoInfo | null {
  const match = url.match(/bitbucket\.org\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const repoName = repo.replace(/\.git$/, '');
  
  const branchMatch = url.match(/\/src\/([^\/]+)(\/(.*))?/);
  const branch = branchMatch?.[1];
  const path = branchMatch?.[3];

  return { owner, repo: repoName, branch, path };
}

export function parseRepoUrl(url: string): RepoInfo | null {
  if (url.includes('github.com')) return parseGitHubUrl(url);
  if (url.includes('gitlab.com')) return parseGitLabUrl(url);
  if (url.includes('bitbucket.org')) return parseBitbucketUrl(url);
  return null;
}