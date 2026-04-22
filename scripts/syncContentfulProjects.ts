type GitHubRepo = {
	full_name: string;
	name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	fork: boolean;
	archived: boolean;
};

type ContentfulEntry = {
	sys: { id: string; version: number };
	fields: Record<string, Record<string, unknown>>;
};

type ProjectSeed = {
	title: string;
	description: string;
	githubURL?: string;
	deploymentURL?: string;
	packageURL?: string;
	isPackage: boolean;
};

const githubSourceOwners = [
	"manan30",
	"pricingch-art",
	"adflare-ai",
	"manan-academia",
] as const;

const significantRepoTargets = [
	"manan30/billiards",
	"manan30/svelte-trivia",
	"manan30/chandrayaan-2",
	"manan30/comed-hourly-pricing",
	"manan30/account-manager",
	"manan30/elegantui",
	"manan30/paused",
	"manan30/unik-id",
	"manan30/personal-blog",
	"manan30/motion-capture",
	"manan30/ui-clones",
	"manan30/ate",
	"manan-academia/AR-Captioning",
	"manan-academia/ar-lighting",
	"manan-academia/AR-Portal",
	"manan-academia/EMiniJava-Compiler",
	"manan-academia/raytracer",
	"manan-academia/SXML-Parser",
] as const;

const packageRepos = new Set(["manan30/paused", "manan30/unik-id"]);

const manualProjectSeeds: ProjectSeed[] = [
	{
		title: "Adflare.ai",
		description:
			"A full product built and shipped end-to-end. Project is now sunsetted.",
		deploymentURL: "https://adflare.ai",
		isPackage: false,
	},
	{
		title: "Pricingch.art",
		description:
			"A full product built and shipped end-to-end. Project is now sunsetted.",
		deploymentURL: "https://pricingch.art",
		isPackage: false,
	},
];

function getArgFlag(flag: string) {
	return Bun.argv.includes(flag);
}

function getEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function toPrettyTitle(name: string) {
	return name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function sanitizeUrl(value: string | null) {
	if (!value) {
		return undefined;
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}

	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		return trimmed;
	}

	return `https://${trimmed}`;
}

function toProjectSeed(repo: GitHubRepo): ProjectSeed {
	const homepage = sanitizeUrl(repo.homepage);
	const isPackage = packageRepos.has(repo.full_name);

	return {
		title: toPrettyTitle(repo.name),
		description:
			repo.description ?? "Significant project from my GitHub portfolio.",
		githubURL: repo.html_url,
		deploymentURL: !isPackage ? homepage : undefined,
		packageURL: isPackage ? homepage : undefined,
		isPackage,
	};
}

async function fetchGitHubRepos(owner: string): Promise<GitHubRepo[]> {
	const token = process.env.GITHUB_TOKEN;

	const response = await fetch(
		`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`,
		{
			headers: {
				Accept: "application/vnd.github+json",
				"User-Agent": "mananjoshi-portfolio-sync",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		},
	);

	if (!response.ok) {
		throw new Error(`GitHub fetch failed for ${owner} with ${response.status}`);
	}

	const data = (await response.json()) as GitHubRepo[];
	return data.filter((repo) => !repo.fork);
}

async function contentfulRequest<T>(
	path: string,
	options: RequestInit,
	managementToken: string,
) {
	const response = await fetch(path, {
		...options,
		headers: {
			Authorization: `Bearer ${managementToken}`,
			"Content-Type": "application/vnd.contentful.management.v1+json",
			...(options.headers ?? {}),
		},
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(
			`Contentful request failed (${response.status}): ${details.slice(0, 300)}`,
		);
	}

	return (await response.json()) as T;
}

async function main() {
	const apply = getArgFlag("--apply");
	const locale = process.env.CONTENTFUL_LOCALE ?? "en-US";

	const reposByOwner = await Promise.all(
		githubSourceOwners.map((owner) => fetchGitHubRepos(owner)),
	);
	const githubRepos = reposByOwner.flat();
	const githubByFullName = new Map(
		githubRepos.map((repo) => [repo.full_name, repo]),
	);

	const selected = significantRepoTargets
		.map((target) => githubByFullName.get(target))
		.filter((repo): repo is GitHubRepo => Boolean(repo));

	const missing = significantRepoTargets.filter(
		(target) => !githubByFullName.has(target),
	);
	if (missing.length > 0) {
		console.warn("Missing repos from GitHub response:", missing.join(", "));
		console.warn(
			"Tip: set GITHUB_TOKEN if any repos are private or org-restricted.",
		);
	}

	const projectsFromGithub = selected.map((repo) => toProjectSeed(repo));
	const projectsByTitle = new Map(
		[...projectsFromGithub, ...manualProjectSeeds].map((project) => [
			project.title.toLowerCase(),
			project,
		]),
	);
	const projects = [...projectsByTitle.values()];

	if (!apply) {
		console.log("Dry run complete. Candidate project payloads:");
		console.log(JSON.stringify(projects, null, 2));
		console.log("\nRun with --apply to upsert these into Contentful.");
		return;
	}

	const spaceId = getEnv("CONTENTFUL_SPACE_ID");
	const managementToken = getEnv("CONTENTFUL_MANAGEMENT_TOKEN");
	const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID ?? "master";

	const baseUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}`;

	const existingEntriesResponse = await contentfulRequest<{
		items: ContentfulEntry[];
	}>(
		`${baseUrl}/entries?content_type=project&limit=1000`,
		{ method: "GET" },
		managementToken,
	);

	const existingByTitle = new Map(
		existingEntriesResponse.items
			.map((entry) => {
				const title = entry.fields.title?.[locale];
				if (typeof title !== "string") {
					return null;
				}

				return [title.toLowerCase(), entry] as const;
			})
			.filter((pair): pair is readonly [string, ContentfulEntry] =>
				Boolean(pair),
			),
	);

	for (const project of projects) {
		const entryFields: Record<string, Record<string, unknown>> = {
			title: { [locale]: project.title },
			description: { [locale]: project.description },
			githubURL: { [locale]: project.githubURL },
			isPackage: { [locale]: project.isPackage },
		};

		if (project.deploymentURL) {
			entryFields.deploymentURL = { [locale]: project.deploymentURL };
		}

		if (project.packageURL) {
			entryFields.packageURL = { [locale]: project.packageURL };
		}

		const existing = existingByTitle.get(project.title.toLowerCase());

		if (!existing) {
			const created = await contentfulRequest<ContentfulEntry>(
				`${baseUrl}/entries`,
				{
					method: "POST",
					headers: {
						"X-Contentful-Content-Type": "project",
					},
					body: JSON.stringify({ fields: entryFields }),
				},
				managementToken,
			);

			await contentfulRequest(
				`${baseUrl}/entries/${created.sys.id}/published`,
				{
					method: "PUT",
					headers: {
						"X-Contentful-Version": String(created.sys.version),
					},
				},
				managementToken,
			);

			console.log(`Created and published: ${project.title}`);
			continue;
		}

		const mergedFields = {
			...existing.fields,
			...entryFields,
		};

		const updated = await contentfulRequest<ContentfulEntry>(
			`${baseUrl}/entries/${existing.sys.id}`,
			{
				method: "PUT",
				headers: {
					"X-Contentful-Version": String(existing.sys.version),
				},
				body: JSON.stringify({ fields: mergedFields }),
			},
			managementToken,
		);

		await contentfulRequest(
			`${baseUrl}/entries/${updated.sys.id}/published`,
			{
				method: "PUT",
				headers: {
					"X-Contentful-Version": String(updated.sys.version),
				},
			},
			managementToken,
		);

		console.log(`Updated and published: ${project.title}`);
	}

	console.log("Contentful sync complete.");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
