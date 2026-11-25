import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { builtinModules } from "node:module";
import { uiComponents } from "./eslint/ui-components.js";
import { uiText } from "./eslint/ui-text.js";

const nodeBuiltins = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)];

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/web/public/**",
      "apps/web/src/paraglide/**",
      "packages/lesson-text/src/paraglide/**",
      ".vercel/**",
      "apps/api/drizzle/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
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
    files: ["apps/web/src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "ui-text": uiText, "ui-components": uiComponents },
    languageOptions: { globals: globals.browser },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "ui-text/no-jsx-text": "error",
      "ui-components/no-arbitrary-colours": "error",
    },
  },
  {
    // Controls come from apps/web/src/ui/ (docs/design/components.md).
    files: ["apps/web/src/**/*.tsx"],
    ignores: ["apps/web/src/ui/**"],
    rules: {
      "ui-components/no-raw-controls": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-aria-components",
              message: "Use the primitives in apps/web/src/ui/; only they import React Aria.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "packages/engine/src/node.ts",
      "tools/**/*.ts",
      "packages/*/test/**/*.ts",
      "apps/web/scripts/**",
      "apps/api/**/*.ts",
      "scripts/**",
      "**/*.config.*",
      "eslint/**",
    ],
    languageOptions: { globals: globals.node },
  },
);
