import { contentfulClient } from "./client";

export type ProjectsData = {
	title: string;
	description?: string;
	deploymentURL?: string;
	packageURL?: string;
	blogURL?: string;
	githubURL?: string;
	isPackage?: boolean;
};

const importanceOrder = [
	"adflare.ai",
	"pricingch.art",
	"billiards",
	"svelte trivia",
	"comed hourly pricing",
	"elegantui",
	"paused",
	"unik id",
	"personal blog",
];

const importanceRank = new Map(
	importanceOrder.map((title, index) => [title, index + 1]),
);

const curatedDescriptions = new Map<string, string>([
	[
		"adflare.ai",
		"AI-powered product photography generator for creating high-quality product visuals, built and shipped end-to-end; now sunsetted.",
	],
	[
		"pricingch.art",
		"Pricing card creation tool for quickly designing and sharing polished pricing layouts; now sunsetted.",
	],
	[
		"billiards",
		"Engineered a browser-based billiards simulation with custom physics using React Three Fiber and Three.js.",
	],
	[
		"svelte trivia",
		"Designed and shipped a fast quiz experience in Svelte with polished game flow and score mechanics.",
	],
	[
		"comed hourly pricing",
		"Built an hourly electricity pricing tracker with automated updates and a simple utility-first interface.",
	],
	[
		"elegantui",
		"Created a reusable React component and hooks library with ergonomics-first APIs and cohesive design patterns.",
	],
	[
		"paused",
		"Published a tiny async timer utility for JavaScript with a minimal API and zero runtime dependencies.",
	],
	[
		"unik id",
		"Published a compact unique ID generator package optimized for lightweight frontend and Node.js usage.",
	],
	[
		"personal blog",
		"Built a TypeScript-powered personal publishing platform focused on writing velocity and clean reading UX.",
	],
]);

const sunsettedTitles = new Set(["adflare.ai", "pricingch.art"]);

function normalizeTitle(title: string) {
	return title.trim().toLowerCase();
}

function getRank(title: string) {
	return importanceRank.get(normalizeTitle(title)) ?? Number.POSITIVE_INFINITY;
}

function hasProjectLinks(project: ProjectsData) {
	return Boolean(
		project.githubURL ||
			project.deploymentURL ||
			project.packageURL ||
			project.blogURL,
	);
}

export async function getProjectsData(params?: { limit?: number }) {
	const data = await contentfulClient.getEntries<ProjectsData>({
		content_type: "project",
		order: "-sys.createdAt",
	});

	const curatedProjects = data.items
		.filter((item) => getRank(item.fields.title) !== Number.POSITIVE_INFINITY)
		.filter((item) => hasProjectLinks(item.fields))
		.map((item) => {
			const normalizedTitle = normalizeTitle(item.fields.title);
			const curatedDescription = curatedDescriptions.get(normalizedTitle);

			if (!curatedDescription) {
				return null;
			}

			return {
				...item,
				fields: {
					...item.fields,
					description: curatedDescription,
					deploymentURL: sunsettedTitles.has(normalizedTitle)
						? undefined
						: item.fields.deploymentURL,
				},
			};
		})
		.filter((item): item is (typeof data.items)[number] => Boolean(item));

	const sortedProjects = [...curatedProjects].sort((a, b) => {
		const rankA = getRank(a.fields.title);
		const rankB = getRank(b.fields.title);

		if (rankA !== rankB) {
			return rankA - rankB;
		}

		return a.fields.title.localeCompare(b.fields.title);
	});

	if (params?.limit) {
		return sortedProjects.slice(0, params.limit);
	}

	return sortedProjects;
}
