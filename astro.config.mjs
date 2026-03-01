// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			sidebar: [
				{
					label: 'React Docs',
					autogenerate: { directory: 'framework/react' },
				},
				{
					label: 'Core Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'ESLint',
					autogenerate: { directory: 'eslint' },
				},
				{
					label: 'Project',
					items: [{ label: 'Sync Status', slug: 'sync-status' }],
				},
			],
		}),
	],
});
