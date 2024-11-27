/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle", "eslint-plugin-react-compiler"],
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": "error",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowBoolean: true, allowNumber: true },
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      { drizzleObjectName: ["db", "ctx.db"] },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      { drizzleObjectName: ["db", "ctx.db"] },
    ],
    "react-compiler/react-compiler": "error",
  },
};
module.exports = config;
