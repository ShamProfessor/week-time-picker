import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: false, // 生产环境不需要 sourcemap
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: false, // 生产环境不需要 sourcemap
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.build.json",
    }),
  ],
  external: [],
});
