import { ESLintUtils } from "@typescript-eslint/utils";

import rule from "../../lib/rules/objectid-compare-rule";
const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run("objectid-compare-rule", rule, {
  valid: [],
  invalid: [
    /* ... */
  ],
});