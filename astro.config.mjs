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
 * @param {any} config
 * @param {string} label
 */
function getSection(config, label) {
	const sections = Array.isArray(config?.sections) ? config.sections : [];
	for (const section of sections) {
		if (section?.label === label) return section;
	}
	return null;
}

/**
 * @param {any} section
 */
function getSectionEntries(section) {
	return Array.isArray(section?.children) ? section.children : [];
}

/**
 * @param {any} section
 * @param {string} framework
 */
function getFrameworkEntries(section, framework = 'react') {
	const frameworks = Array.isArray(section?.frameworks) ? section.frameworks : [];
	for (const item of frameworks) {
		if (item?.label === framework) {
			return Array.isArray(item?.children) ? item.children : [];
		}
	}
	return [];
}

/**
 * @param {Array<{label?: string, to?: string}>} entries
 */
function toSidebarLinks(entries) {
	/** @type {Array<{label: string, link: string}>} */
	const links = [];

	for (const entry of entries) {
		if (typeof entry?.to !== 'string') continue;
		links.push({
			label: entry.label || entry.to,
			link: `/${entry.to.toLowerCase()}/`,
		});
	}

	return links;
}

/**
 * @param {string} label
 * @param {Array<any>} items
 * @param {boolean} [collapsed]
 */
function createGroup(label, items, collapsed = false) {
	if (!items.length) return undefined;
	return { label, items, collapsed };
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

	const gettingStarted = toSidebarLinks(
		getFrameworkEntries(getSection(config, 'Getting Started'), 'react')
	);
	const guides = toSidebarLinks(
		getFrameworkEntries(getSection(config, 'Guides & Concepts'), 'react')
	);
	const apiSection = getSection(config, 'API Reference');
	const apiCore = toSidebarLinks(getSectionEntries(apiSection));
	const apiReact = toSidebarLinks(getFrameworkEntries(apiSection, 'react'));
	const plugins = toSidebarLinks(getFrameworkEntries(getSection(config, 'Plugins'), 'react'));
	const examples = toSidebarLinks(getFrameworkEntries(getSection(config, 'Examples'), 'react'));
	const community = toSidebarLinks(
		getFrameworkEntries(getSection(config, 'Community Resources'), 'react')
	);

	/** @type {Array<any>} */
	const apiItems = [];
	const coreGroup = createGroup('Core', apiCore);
	const reactGroup = createGroup('React', apiReact);
	if (coreGroup) apiItems.push(coreGroup);
	if (reactGroup) apiItems.push(reactGroup);

	/** @type {Array<any>} */
	const items = [];
	const gettingStartedGroup = createGroup('Getting Started', gettingStarted);
	const guidesGroup = createGroup('Guides & Concepts', guides);
	const apiGroup = createGroup('API Reference', apiItems);
	const pluginsGroup = createGroup('Plugins', plugins, true);
	const examplesGroup = createGroup('Examples', examples, true);
	const communityGroup = createGroup('Community Resources', community, true);

	if (gettingStartedGroup) items.push(gettingStartedGroup);
	if (guidesGroup) items.push(guidesGroup);
	if (apiGroup) items.push(apiGroup);
	if (pluginsGroup) items.push(pluginsGroup);
	if (examplesGroup) items.push(examplesGroup);
	if (communityGroup) items.push(communityGroup);

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

	const eslint = toSidebarLinks(getSectionEntries(getSection(config, 'ESLint Plugin Query')));
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
