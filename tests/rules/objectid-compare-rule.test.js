"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const objectid_compare_rule_1 = __importDefault(require("../../lib/rules/objectid-compare-rule"));
const ruleTester = new utils_1.ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
});
ruleTester.run("objectid-compare-rule", objectid_compare_rule_1.default, {
    valid: [],
    invalid: [
    /* ... */
    ],
});
//# sourceMappingURL=objectid-compare-rule.test.js.map