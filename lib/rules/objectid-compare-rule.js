"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const tsutils = __importStar(require("tsutils"));
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://github.com/almedinhodzic/${name}`);
function AreNodesObjectId(checker, nodeTypeLeft, nodeTypeRight) {
    return (isObjectId(checker, nodeTypeLeft) && isObjectId(checker, nodeTypeRight));
}
function isObjectId(checker, nodeType) {
    for (const ty of tsutils.unionTypeParts(checker.getApparentType(nodeType))) {
        if (checker.typeToString(ty) === "ObjectId") {
            return true;
        }
    }
    return false;
}
function hasEqualsMethod(checker, nodeType) {
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
                            return fixer.replaceText(node, hasEqualsMethod(checker, nodeTypeLeft)
                                ? `${nodeNameLeft}.equals(${nodeNameRight})`
                                : `${nodeNameRight}.equals(${nodeNameLeft})`);
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
            compareObjIdMsg: "Do not compare ObjectId with '===', instead use .equals method. It leads to many false negatives",
        },
        type: "suggestion",
        schema: [],
        fixable: "code",
    },
    name: "objectid-compare",
    defaultOptions: [],
});
exports.default = rule;
//# sourceMappingURL=objectid-compare-rule.js.map