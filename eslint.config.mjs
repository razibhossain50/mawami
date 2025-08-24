import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".git/**",
      "dist/**",
      "build/**",
      "public/**",
      "*.config.js",
      "*.config.ts"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable ALL Prettier-related rules
      "prettier/prettier": "off",

      // Disable TypeScript strict rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Disable React and Next.js warnings
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@next/next/no-img-element": "off",

      // Disable formatting-related rules
      "indent": "off",
      "quotes": "off",
      "semi": "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",
      "space-before-function-paren": "off",
      "space-in-parens": "off",
      "keyword-spacing": "off",
      "space-before-blocks": "off",
      "brace-style": "off",
      "comma-spacing": "off",
      "key-spacing": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
      "no-multiple-empty-lines": "off",
      "padded-blocks": "off",
      "space-infix-ops": "off",
      "space-unary-ops": "off",
      "spaced-comment": "off",
      "arrow-spacing": "off",
      "block-spacing": "off",
      "computed-property-spacing": "off",
      "func-call-spacing": "off",
      "generator-star-spacing": "off",
      "jsx-quotes": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-whitespace-before-property": "off",
      "object-property-newline": "off",
      "operator-linebreak": "off",
      "rest-spread-spacing": "off",
      "semi-spacing": "off",
      "switch-colon-spacing": "off",
      "template-curly-spacing": "off",
      "template-tag-spacing": "off",
      "unicode-bom": "off",
      "wrap-iife": "off",
      "yield-star-spacing": "off",

      // Disable TypeScript formatting rules
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/quotes": "off",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/object-curly-spacing": "off",
      "@typescript-eslint/space-before-function-paren": "off",
      "@typescript-eslint/keyword-spacing": "off",
      "@typescript-eslint/space-infix-ops": "off",
      "@typescript-eslint/brace-style": "off",
      "@typescript-eslint/comma-spacing": "off",
      "@typescript-eslint/func-call-spacing": "off",
      "@typescript-eslint/space-before-blocks": "off",

      // Disable React formatting rules
      "react/jsx-indent": "off",
      "react/jsx-indent-props": "off",
      "react/jsx-closing-bracket-location": "off",
      "react/jsx-closing-tag-location": "off",
      "react/jsx-curly-spacing": "off",
      "react/jsx-equals-spacing": "off",
      "react/jsx-first-prop-new-line": "off",
      "react/jsx-max-props-per-line": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-props-no-multi-spaces": "off",
      "react/jsx-tag-spacing": "off",
      "react/jsx-wrap-multilines": "off",


    },
  },
];

export default eslintConfig;
