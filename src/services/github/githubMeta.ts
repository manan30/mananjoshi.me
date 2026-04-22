type GithubRepoMeta = {
	stargazers_count: number;
	language: string | null;
	updated_at: string;
};

export type ProjectGithubMeta = {
	stars: number;
	language?: string;
	updatedAt: string;
};

const githubApiBase = "https://api.github.com/repos";
const metadataCache = new Map<string, ProjectGithubMeta | null>();

function getGithubRepoPath(url?: string) {
	if (!url) {
		return null;
	}

	try {
		const parsed = new URL(url);
		if (parsed.hostname !== "github.com") {
			return null;
		}

		const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
		if (!owner || !repo) {
			return null;
		}

		return `${owner}/${repo}`;
	} catch {
		return null;
	}
}

async function fetchGithubMeta(repoPath: string) {
	if (metadataCache.has(repoPath)) {
		return metadataCache.get(repoPath) ?? null;
	}

	const token = import.meta.env.GITHUB_TOKEN;

	const response = await fetch(`${githubApiBase}/${repoPath}`, {
		headers: {
			Accept: "application/vnd.github+json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	if (!response.ok) {
		metadataCache.set(repoPath, null);
		return null;
	}

	const data = (await response.json()) as GithubRepoMeta;

	const meta = {
		stars: data.stargazers_count,
		language: data.language ?? undefined,
		updatedAt: data.updated_at,
	} satisfies ProjectGithubMeta;

	metadataCache.set(repoPath, meta);

	return meta;
}

export async function getGithubMetaByRepoUrl(githubUrl?: string) {
	const repoPath = getGithubRepoPath(githubUrl);
	if (!repoPath) {
		return null;
	}

	return fetchGithubMeta(repoPath);
}
