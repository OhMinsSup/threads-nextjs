import baseConfig, { restrictEnvAccess } from "@acme/eslint-config/base";
import nextjsConfig from "@thread/eslint-config/nextjs";
import reactConfig from "@thread/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];