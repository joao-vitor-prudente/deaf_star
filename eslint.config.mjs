// @ts-check

import eslintJs from "@eslint/js";
import eslintConfigNext from "@next/eslint-plugin-next";
import * as eslintPluginDrizzle from "eslint-plugin-drizzle";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactCompiler from "eslint-plugin-react-compiler";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginSonarJs from "eslint-plugin-sonarjs";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  eslintJs.configs.recommended,
  typescriptEslint.configs.strictTypeChecked,
  typescriptEslint.configs.stylisticTypeChecked,
  eslintPluginJsxA11y.flatConfigs.recommended,
  eslintPluginSonarJs.configs.recommended,
  // @ts-expect-error pourly typed config
  eslintPluginReact.configs.flat.recommended,
  // @ts-expect-error pourly typed config
  eslintPluginReact.configs.flat["jsx-runtime"],
  eslintPluginPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowBoolean: true, allowNumber: true },
      ],
    },
  },
  {
    files: ["**/*.mjs", "**/*.js"],
    extends: [typescriptEslint.configs.disableTypeChecked],
  },
  {
    settings: { react: { version: "detect" } },
    rules: { "react/prop-types": "off" },
  },
  {
    plugins: { "react-compiler": eslintPluginReactCompiler },
    rules: { "react-compiler/react-compiler": "error" },
  },
  {
    plugins: { "react-hooks": eslintPluginReactHooks },
    rules: eslintPluginReactHooks.configs.recommended.rules,
  },
  {
    plugins: { drizzle: eslintPluginDrizzle },
    rules: {
      ...eslintPluginDrizzle.configs.recommended.rules,
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": eslintConfigNext,
    },
    rules: {
      ...eslintConfigNext.configs.recommended.rules,
      ...eslintConfigNext.configs["core-web-vitals"].rules,
    },
  },
);
