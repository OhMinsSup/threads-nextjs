import type { Options } from "tsup";
import { defineConfig } from "tsup";

export default defineConfig((options: Options) => [
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    minify: !options.watch,
    minifyWhitespace: true,
    clean: true,
    ...options,
  },
  {
    entry: ["src/client.ts"],
    format: ["esm", "cjs"],
    dts: true,
    minify: !options.watch,
    minifyWhitespace: true,
    clean: true,
    ...options,
  },
  {
    entry: ["src/selector.ts"],
    format: ["esm", "cjs"],
    dts: true,
    minify: !options.watch,
    minifyWhitespace: true,
    clean: true,
    ...options,
  },
]);
