import { ESLintUtils } from "@typescript-eslint/utils";
import * as ts from "typescript";
import * as tsutils from "tsutils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/almedinhodzic/${name}`
);

function AreNodesObjectId(
  checker: ts.TypeChecker,
  nodeTypeLeft: ts.Type,
  nodeTypeRight: ts.Type
): boolean {
  return (
    isObjectId(checker, nodeTypeLeft) && isObjectId(checker, nodeTypeRight)
  );
}

function isObjectId(checker: ts.TypeChecker, nodeType: ts.Type) {
  for (const ty of tsutils.unionTypeParts(checker.getApparentType(nodeType))) {
    if (checker.typeToString(ty) === "ObjectId") {
      return true;
    }
  }
  return false;
}

function hasEqualsMethod(checker: ts.TypeChecker, nodeType: ts.Type) {
  for (const ty of tsutils.unionTypeParts(checker.getApparentType(nodeType))) {
    // Because type can be union type, and if it is ObjectId and string, we should not
    // put equals method to this variable, because only objects has equals
    // So for that reason, if is undefined for one type in union ( if it is union )
    // Equals can not be used at all
    if (ty.getProperty("equals") === undefined) {
      return false;
    }
  }
  return true;
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
                hasEqualsMethod(checker, nodeTypeLeft)
                  ? `${nodeNameLeft}.equals(${nodeNameRight})`
                  : `${nodeNameRight}.equals(${nodeNameLeft})`
              );
            },
          });
        }
      },
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
    fixable: "code",
  },
  name: "objectid-compare",
  defaultOptions: [],
});

export default rule;
