import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
export default defineConfig({ output: 'static', build: { inlineStylesheets: 'always' }, devToolbar: { enabled: false } });
