// Local ESLint rules for user-facing text (docs/design/ux-principles.md UX-32): every string a
// user can see or hear comes from the message catalogue, so JSX may not contain words.
// It sees JSX only; strings built in hooks or helpers are left to review.

const LETTER = /\p{L}/u;

// Attributes whose value is read or shown to the user.
const TEXT_ATTRIBUTES = new Set([
  "aria-label",
  "aria-description",
  "aria-placeholder",
  "title",
  "placeholder",
  "alt",
]);

const report = (context, node) =>
  context.report({
    node,
    message:
      "User-facing text must come from the message catalogue (m.key(), UX-32). Add it to apps/web/messages/<locale>.json.",
  });

const noJsxText = {
  meta: {
    type: "problem",
    docs: { description: "Disallow words written directly in JSX or its text attributes" },
    schema: [],
  },
  create(context) {
    return {
      JSXText(node) {
        if (LETTER.test(node.value)) report(context, node);
      },
      JSXAttribute(node) {
        const name = node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (!name || !TEXT_ATTRIBUTES.has(name) || !node.value) return;
        const value = node.value.type === "JSXExpressionContainer" ? node.value.expression : node.value;
        if (value.type === "Literal" && typeof value.value === "string" && LETTER.test(value.value)) {
          report(context, node);
        }
        if (value.type === "TemplateLiteral" && value.quasis.some((q) => LETTER.test(q.value.cooked ?? ""))) {
          report(context, node);
        }
      },
    };
  },
};

export const uiText = { meta: { name: "ui-text" }, rules: { "no-jsx-text": noJsxText } };
