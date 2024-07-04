import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

import base from './base';

const config: Omit<Config, 'content'> = {
  content: base.content,
  presets: [base],
  plugins: [animate, typography],
};

export default config;
