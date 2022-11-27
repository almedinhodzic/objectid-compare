import { ESLintUtils } from "@typescript-eslint/utils";
import * as ts from "typescript";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/almedinhodzic/${name}`
);

function isObjectId(checker: ts.TypeChecker,nodeType: ts.Type):boolean {
  return checker.typeToString(nodeType).search("ObjectId") !== -1;
}

function AreNodesObjectId(checker: ts.TypeChecker, nodeTypeLeft: ts.Type, 
  nodeTypeRight: ts.Type): boolean {
    return isObjectId(checker, nodeTypeLeft) && isObjectId(checker, nodeTypeRight);
}

const rule = createRule({
  create(context) {
    return {
      BinaryExpression(node) {
        // 1. Grab the TypeScript program from parser services
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // 2. Find the backing TS node for the ES node, then that TS type
        const originalNodeLeft = parserServices.esTreeNodeToTSNodeMap.get(
          node.left
        );
        const originalNodeRight = parserServices.esTreeNodeToTSNodeMap.get(
          node.right
        );

        // Get node types
        const nodeTypeLeft = checker.getTypeAtLocation(originalNodeLeft);
        const nodeTypeRight = checker.getTypeAtLocation(originalNodeRight);

        // Get names of variables
        const nodeNameLeft = context.getSourceCode().getFirstToken(node)?.value;
        const nodeNameRight = context.getSourceCode().getLastToken(node)?.value;

        // 3. Report if both sides are ObjectId
        if (
          AreNodesObjectId(checker, nodeTypeLeft, nodeTypeRight) &&
          node.operator === "==="
        ) {
          context.report({
            messageId: "compareObjIdMsg",
            node: node,
            // Fix on eslint fix run
            fix: (fixer) => {
              return fixer.replaceText(
                node,
                `${nodeNameLeft}.equals(${nodeNameRight})`
              );
            },
          });
        }
      }
    };
  },
  meta: {
    docs: {
      description: "Avoid '===' comparation between ObjectId types.",
      recommended: "warn",
    },
    messages: {
      compareObjIdMsg:
        "Do not compare ObjectId with '===', instead use .equals method. It leads to many false negatives",
    },
    type: "suggestion",
    schema: [],
    fixable: "code"
  },
  name: "objectid-compare",
  defaultOptions: [],
});

export default rule;