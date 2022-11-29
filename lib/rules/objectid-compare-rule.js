"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://github.com/almedinhodzic/${name}`);
function AreNodesObjectId(checker, nodeTypeLeft, nodeTypeRight) {
    return (checker.typeToString(nodeTypeLeft).search("ObjectId") !== -1 &&
        checker.typeToString(nodeTypeRight).search("ObjectId") !== -1);
}
const rule = createRule({
    create(context) {
        return {
            BinaryExpression(node) {
                var _a, _b;
                // 1. Grab the TypeScript program from parser services
                const parserServices = utils_1.ESLintUtils.getParserServices(context);
                const checker = parserServices.program.getTypeChecker();
                // 2. Find the backing TS node for the ES node, then that TS type
                const originalNodeLeft = parserServices.esTreeNodeToTSNodeMap.get(node.left);
                const originalNodeRight = parserServices.esTreeNodeToTSNodeMap.get(node.right);
                // Get node types
                const nodeTypeLeft = checker.getTypeAtLocation(originalNodeLeft);
                const nodeTypeRight = checker.getTypeAtLocation(originalNodeRight);
                // Get names of variables
                const nodeNameLeft = (_a = context.getSourceCode().getFirstToken(node)) === null || _a === void 0 ? void 0 : _a.value;
                const nodeNameRight = (_b = context.getSourceCode().getLastToken(node)) === null || _b === void 0 ? void 0 : _b.value;
                // 3. Report if both sides are ObjectId
                if (AreNodesObjectId(checker, nodeTypeLeft, nodeTypeRight) &&
                    node.operator === "===") {
                    context.report({
                        messageId: "compareObjIdMsg",
                        node: node,
                        // Fix on eslint fix run
                        fix: (fixer) => {
                            return fixer.replaceText(node, `${nodeNameLeft}.equals(${nodeNameRight})`);
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
            compareObjIdMsg: "Do not compare ObjectId with '===', instead use .equals method. It leads to many false negatives",
        },
        type: "suggestion",
        schema: [],
        fixable: "code"
    },
    name: "objectid-compare",
    defaultOptions: [],
});
exports.default = rule;
//# sourceMappingURL=objectid-compare-rule.js.map