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
 * @param {any} config
 * @param {string} label
 */
function getSection(config, label) {
	return config?.sections?.find((section) => section?.label === label);
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
	const target = frameworks.find((item) => item?.label === framework);
	return Array.isArray(target?.children) ? target.children : [];
}

/**
 * @param {Array<{label?: string, to?: string}>} entries
 */
function toSidebarLinks(entries) {
	return entries
		.filter((entry) => typeof entry?.to === 'string')
		.map((entry) => ({
			label: entry.label || entry.to,
			link: `/${entry.to.toLowerCase()}/`,
		}));
}

/**
 * @param {string} label
 * @param {Array<any>} items
 * @param {boolean} [collapsed]
 */
function createGroup(label, items, collapsed = false) {
	if (!items.length) return null;
	return { label, items, collapsed };
}

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

	const apiItems = [
		createGroup('Core', apiCore),
		createGroup('React', apiReact),
	].filter(Boolean);

	const items = [
		createGroup('Getting Started', gettingStarted),
		createGroup('Guides & Concepts', guides),
		createGroup('API Reference', apiItems),
		createGroup('Plugins', plugins, true),
		createGroup('Examples', examples, true),
		createGroup('Community Resources', community, true),
	].filter(Boolean);

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
	{
		label: 'Project',
		items: [{ label: 'Sync Status', slug: 'sync-status' }],
	},
];

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://example.com',
	integrations: [
		starlight({
			title: 'TanStack Query React v5 Mirror',
			description: 'Unofficial mirror of TanStack Query React v5 docs with automated upstream sync.',
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
