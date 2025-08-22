import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      "file": "dist/index.js",
      "format": "cjs",
      "sourcemap": true,
      "exports": "named"
    },
    {
      "file": "dist/index.esm.js",
      "format": "esm",
      "sourcemap": true
    }
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true, // 让 rollup 插件生成声明文件
      declarationDir: "./dist",
      declarationMap: true
    })
  ],
  external: []
});