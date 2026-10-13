import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
export default defineConfig({ output: 'static', base: '/forja/', build: { inlineStylesheets: 'always' }, devToolbar: { enabled: false } });
