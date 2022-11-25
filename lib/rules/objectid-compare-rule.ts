import { ESLintUtils } from "@typescript-eslint/utils";
import * as ts from "typescript";
import * as tsutils from "tsutils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/almedinhodzic/${name}`
);

const rule = createRule({
  create(context) {
    return {
      BinaryExpression(node) {
        // 1. Grab the TypeScript program from parser services
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // 2. Find the backing TS node for the ES node, then that TS type
        const originalNode = parserServices.esTreeNodeToTSNodeMap.get(
          node.right
        );
        const nodeType = checker.getTypeAtLocation(originalNode);

        // Test rule to see if it works
        console.log(node);

          // TODO: Make real message and report warning, implement fix, etc.
        context.report({
          messageId: "compareObjId",
          node: node.right,
        });
        
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid '===' comparation between ObjectId types.",
      recommended: "warn",
    },
    messages: {
      compareObjId: "Do not compare ObjectId with '===', instead use .equals method.",
    },
    type: "suggestion",
    schema: [],
  },
  name: "objectid-compare",
  defaultOptions: [],
});

export default rule;