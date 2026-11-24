// Local ESLint rules for how the web UI is built (docs/design/components.md, D15): controls come
// from the primitives in apps/web/src/ui/, and colours only from the semantic tokens.

const RAW_CONTROLS = new Set(["button", "input", "select", "textarea", "dialog"]);

const noRawControls = {
  meta: {
    type: "suggestion",
    docs: { description: "Disallow raw interactive elements outside apps/web/src/ui/" },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== "JSXIdentifier" || !RAW_CONTROLS.has(node.name.name)) return;
        context.report({
          node,
          message: `Use a primitive from apps/web/src/ui/ instead of <${node.name.name}> (UX-37). If there isn't one, add it there first.`,
        });
      },
    };
  },
};

// A colour utility with an arbitrary value: `bg-[#b42318]`, `text-[rgb(0_0_0)]`,
// `border-[var(--x)]`. Arbitrary lengths (`w-[18rem]`) are fine.
const ARBITRARY_COLOUR =
  /(?:^|[\s:"'`])!?(?:bg|text|border(?:-[xytrblse])?|outline|ring|ring-offset|fill|stroke|decoration|from|via|to|shadow|inset-shadow|accent|caret|divide|placeholder)-\[(?:#|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color-mix\(|color:|var\(--)/;

const noArbitraryColours = {
  meta: {
    type: "problem",
    docs: { description: "Disallow Tailwind colour utilities with arbitrary values" },
    schema: [],
  },
  create(context) {
    const check = (node, text) => {
      if (ARBITRARY_COLOUR.test(text))
        context.report({
          node,
          message:
            "Use a semantic colour token (bg-primary, text-fg-muted...), not an arbitrary colour. Missing one? Add it to apps/web/src/theme.css.",
        });
    };
    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

export const uiComponents = {
  rules: { "no-raw-controls": noRawControls, "no-arbitrary-colours": noArbitraryColours },
};
