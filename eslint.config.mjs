import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override or disable specific rules:
  {
    rules: {
      // Disable `any` usage checks:
      "@typescript-eslint/no-explicit-any": "off",
      // Disable no-unused-vars checks:
      "@typescript-eslint/no-unused-vars": "off",
      // Disable the React hooks exhaustive deps check:
      "react-hooks/exhaustive-deps": "off",
      // Disable 'no-var' rule:
      "no-var": "off",
      // Disable the ban on @ts-comment usage:
      "@typescript-eslint/ban-ts-comment": "off",
      // Disable the `prefer-const` rule:
      'prefer-const': 'off',
    },
  },
];

export default eslintConfig;
