"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RuleTester_1 = require("../RuleTester");
const objectid_compare_rule_1 = __importDefault(require("../../../lib/rules/objectid-compare-rule"));
const ruleTester = new RuleTester_1.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: (0, RuleTester_1.getFixturesRootDir)(),
    },
});
ruleTester.run("objectid-compare-rule", objectid_compare_rule_1.default, {
    valid: [
        {
            code: `
        import { ObjectId } from "mongodb";

        function TestFunc(a:string | ObjectId, b:ObjectId): boolean {
          return  a.equals(b);
        }
      `,
        },
        {
            code: `
        import { ObjectId } from "mongodb";

        const equalOk = (id1: ObjectId | string | null, id2: string | ObjectId) => {
          return id1.equals(id2);
        }
      `,
        },
        {
            code: `
        import { ObjectId } from "mongodb";

        const x = new ObjectId()
        const y = new ObjectId(x.toString())
        console.log(x.equals(y))
      `,
        },
    ],
    invalid: [
        {
            code: `
        import { ObjectId } from "mongodb";

        function TestFunc(a:string | ObjectId, b:ObjectId): boolean {
          return  a === b;
        }
      `,
            output: `
        import { ObjectId } from "mongodb";

        function TestFunc(a:string | ObjectId, b:ObjectId): boolean {
          return  a.equals(b);
        }
      `,
            errors: [
                {
                    messageId: "compareObjIdMsg",
                },
            ],
        },
        {
            code: `
        import { ObjectId } from "mongodb";

        const equalOk = (id1: ObjectId | string | null, id2: string | ObjectId) => {
          return id1 === id2;
        }
      `,
            output: `
        import { ObjectId } from "mongodb";

        const equalOk = (id1: ObjectId | string | null, id2: string | ObjectId) => {
          return id1.equals(id2);
        }
      `,
            errors: [
                {
                    messageId: "compareObjIdMsg",
                    suggestions: [],
                },
            ],
        },
        {
            code: `
        import { ObjectId } from "mongodb";

        const x = new ObjectId()
        const y = new ObjectId(x.toString())
        console.log(x === y)
      `,
            output: `
        import { ObjectId } from "mongodb";

        const x = new ObjectId()
        const y = new ObjectId(x.toString())
        console.log(x.equals(y))
      `,
            errors: [
                {
                    messageId: "compareObjIdMsg",
                    suggestions: [],
                },
            ],
        },
    ],
});
//# sourceMappingURL=objectid-compare-rule.test.js.map