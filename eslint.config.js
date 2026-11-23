import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { builtinModules } from "node:module";

const nodeBuiltins = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)];

export default tseslint.config(
  { ignores: ["**/node_modules/**", "prototype/**", "**/dist/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // The teaching core must run anywhere: browser, Node, React Native.
    // No Node built-ins, no DOM, no I/O.
    files: ["packages/core/src/**/*.ts"],
    languageOptions: { globals: {} },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: nodeBuiltins.map((name) => ({
            name,
            message: "packages/core must stay platform-independent.",
          })),
        },
      ],
      "no-restricted-globals": [
        "error",
        ...["window", "document", "process", "require", "Buffer", "fetch", "localStorage"].map((name) => ({
          name,
          message: "packages/core must stay platform-independent.",
        })),
      ],
    },
  },
  {
    files: ["packages/engine/src/node.ts", "tools/**/*.ts", "packages/*/test/**/*.ts", "*.config.*"],
    languageOptions: { globals: globals.node },
  },
);
