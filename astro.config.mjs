import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
export default defineConfig({ output: 'static', devToolbar: { enabled: false } });
