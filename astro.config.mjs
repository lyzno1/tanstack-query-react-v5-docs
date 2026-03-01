// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPSTREAM_DOCS_CONFIG_PATH = path.join(__dirname, 'upstream', 'docs.config.json');

function readUpstreamDocsConfig() {
	if (!existsSync(UPSTREAM_DOCS_CONFIG_PATH)) return null;
	try {
		return JSON.parse(readFileSync(UPSTREAM_DOCS_CONFIG_PATH, 'utf8'));
	} catch (error) {
		console.warn(
			`[sidebar] Failed to parse upstream/docs.config.json, using fallback autogenerate sidebar.\n${error}`
		);
		return null;
	}
}

/**
 * Rewrite internal markdown links to Starlight doc routes.
 * Example:
 * - ../reference/useQuery.md -> ../reference/usequery/
 * - ../../guides/filters.md#query-filters -> ../../guides/filters/#query-filters
 */
function normalizeInternalMarkdownLinks() {
	/**
	 * @param {string} url
	 */
	function normalizeUrl(url) {
		if (
			url.startsWith('http://') ||
			url.startsWith('https://') ||
			url.startsWith('mailto:') ||
			url.startsWith('tel:') ||
			url.startsWith('#')
		) {
			return url;
		}

		const [beforeHash, hash = ''] = url.split('#');
		const [pathname, query = ''] = beforeHash.split('?');
		if (!/\.mdx?$/i.test(pathname)) return url;

		const withoutExt = pathname.replace(/\.mdx?$/i, '');
		const normalizedPath = withoutExt
			.split('/')
			.map((segment) => {
				if (segment === '' || segment === '.' || segment === '..') return segment;
				return segment.toLowerCase();
			})
			.join('/');
		const withSlash = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
		const queryPart = query ? `?${query}` : '';
		const hashPart = hash ? `#${hash}` : '';
		return `${withSlash}${queryPart}${hashPart}`;
	}

	/**
	 * @param {any} node
	 */
	function walk(node) {
		if (!node || typeof node !== 'object') return;

		if (node.type === 'link' && typeof node.url === 'string') {
			node.url = normalizeUrl(node.url);
		}

		const children = Array.isArray(node.children) ? node.children : [];
		for (const child of children) {
			walk(child);
		}
	}

	return (
		/** @type {any} */ tree,
	) => {
		walk(tree);
	};
}

/**
 * @typedef {{label: string, link: string, route: string, score: number, index: number}} RankedLink
 */

const SORT_RULES = [
	{ score: 0, pattern: /(^|\/)(overview|getting-started|quick-start|quickstart|installation)(\/|$)/ },
	{ score: 1, pattern: /(^|\/)guide(s)?(\/|$)/ },
	{ score: 2, pattern: /(^|\/)(api|reference)(\/|$)/ },
	{ score: 3, pattern: /(^|\/)(plugin|plugins|eslint|example|examples|integration|integrations)(\/|$)/ },
	{ score: 4, pattern: /(^|\/)(community|video|videos|faq|comparison)(\/|$)/ },
];

/**
 * @param {string} value
 */
function scoreByKeywords(value) {
	const normalized = value.trim().toLowerCase().replace(/\s+/g, '-');
	for (const rule of SORT_RULES) {
		if (rule.pattern.test(normalized)) return rule.score;
	}
	return 5;
}

/**
 * @param {any} section
 * @param {string} framework
 */
function getSectionDocEntries(section, framework = 'react') {
	const shared = Array.isArray(section?.children) ? section.children : [];
	const frameworks = Array.isArray(section?.frameworks) ? section.frameworks : [];
	const frameworkChildren = [];

	for (const item of frameworks) {
		if (item?.label === framework && Array.isArray(item?.children)) {
			frameworkChildren.push(...item.children);
		}
	}

	return [...shared, ...frameworkChildren];
}

/**
 * @param {RankedLink} a
 * @param {RankedLink} b
 */
function compareRankedLinks(a, b) {
	if (a.score !== b.score) return a.score - b.score;
	return a.index - b.index;
}

/**
 * @param {Array<{label?: string, to?: string}>} entries
 * @param {(route: string) => boolean} filterRoute
 * @returns {RankedLink[]} Ranked links sorted by semantic priority.
 */
function toRankedSidebarLinks(entries, filterRoute) {
	/** @type {Map<string, RankedLink>} */
	const uniqueByRoute = new Map();

	for (let index = 0; index < entries.length; index += 1) {
		const entry = entries[index];
		if (typeof entry?.to !== 'string') continue;
		const route = entry.to.toLowerCase();
		if (!filterRoute(route)) continue;

		const candidate = {
			label: entry.label || entry.to,
			link: `/${route}/`,
			route,
			score: scoreByKeywords(route),
			index,
		};

		const existing = uniqueByRoute.get(route);
		if (!existing || compareRankedLinks(candidate, existing) < 0) {
			uniqueByRoute.set(route, candidate);
		}
	}

	return [...uniqueByRoute.values()].sort(compareRankedLinks);
}

/**
 * @param {any} config
 * @param {string} framework
 * @param {(route: string) => boolean} filterRoute
 */
function collectSidebarSections(config, framework, filterRoute) {
	const sections = Array.isArray(config?.sections) ? config.sections : [];
	const grouped = [];

	for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
		const section = sections[sectionIndex];
		const sectionEntries = getSectionDocEntries(section, framework);
		const links = toRankedSidebarLinks(sectionEntries, filterRoute);
		if (!links.length) continue;

		const rawLabel =
			typeof section?.label === 'string' && section.label.trim()
				? section.label.trim()
				: `Section ${sectionIndex + 1}`;

		const sectionScore = Math.min(
			scoreByKeywords(rawLabel),
			...links.map((link) => link.score),
		);

		grouped.push({
			label: rawLabel,
			score: sectionScore,
			index: sectionIndex,
			items: links.map(({ label, link }) => ({ label, link })),
		});
	}

	grouped.sort((a, b) => {
		if (a.score !== b.score) return a.score - b.score;
		return a.index - b.index;
	});

	return grouped;
}

/**
 * @param {any} config
 * @param {string} framework
 * @param {(route: string) => boolean} filterRoute
 */
function collectFlatSidebarLinks(config, framework, filterRoute) {
	const sections = Array.isArray(config?.sections) ? config.sections : [];
	const allEntries = [];

	for (const section of sections) {
		allEntries.push(...getSectionDocEntries(section, framework));
	}

	return toRankedSidebarLinks(allEntries, filterRoute).map(({ label, link }) => ({
		label,
		link,
	}));
}

/**
 * @param {string} route
 */
function isReactDocsRoute(route) {
	return route.startsWith('framework/react/') || route.startsWith('reference/');
}

/**
 * @param {string} route
 */
function isEslintRoute(route) {
	return route.startsWith('eslint/');
}

/**
 * @param {any} config
 */
function buildReactSidebar(config) {
	if (!config) {
		return {
			label: 'React Docs',
			autogenerate: { directory: 'framework/react' },
		};
	}

	const sections = collectSidebarSections(config, 'react', isReactDocsRoute);
	const items = sections.map((section) => ({
		label: section.label,
		items: section.items,
		collapsed: section.score >= 3,
	}));

	if (!items.length) {
		return {
			label: 'React Docs',
			autogenerate: { directory: 'framework/react' },
		};
	}

	return {
		label: 'React Docs',
		items,
	};
}

/**
 * @param {any} config
 */
function buildEslintSidebar(config) {
	if (!config) {
		return {
			label: 'ESLint',
			autogenerate: { directory: 'eslint' },
		};
	}

	const eslint = collectFlatSidebarLinks(config, 'react', isEslintRoute);
	if (!eslint.length) {
		return {
			label: 'ESLint',
			autogenerate: { directory: 'eslint' },
		};
	}

	return {
		label: 'ESLint',
		items: eslint,
	};
}

const upstreamDocsConfig = readUpstreamDocsConfig();
const sidebar = [
	buildReactSidebar(upstreamDocsConfig),
	buildEslintSidebar(upstreamDocsConfig),
];

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://example.com',
	markdown: {
		remarkPlugins: [normalizeInternalMarkdownLinks],
	},
	integrations: [
		starlight({
			title: 'TanStack Query React v5 Docs',
			description: 'TanStack Query React v5 documentation with automated upstream synchronization.',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				zh: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			customCss: ['./src/styles/theme.css'],
			social: [
				{
					icon: 'github',
					label: 'TanStack Query Upstream',
					href: 'https://github.com/TanStack/query',
				},
			],
			sidebar,
		}),
	],
});
