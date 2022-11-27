import {  getFixturesRootDir, RuleTester } from '../RuleTester';
import rule from "../../../lib/rules/objectid-compare-rule";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: getFixturesRootDir(),
  },
});

ruleTester.run("objectid-compare-rule", rule, {
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