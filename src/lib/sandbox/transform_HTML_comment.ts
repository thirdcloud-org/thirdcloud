import { Node } from "estree";

const patterns = [/<--/g, /-->/g, /<\!--/g, /\!-->/g];
export const node_transform_HTML_comment = (node: Node): Node | undefined => {
  if (node.type == "TemplateElement") {
    const raw = patterns.reduce((v, p) => v.replace(p, "%"), node.value.raw);

    return {
      ...node,
      type: "TemplateElement",
      value: {
        raw,
      },
    };
  }

  if (node.type === "Literal" && typeof node.value === "string") {
    const value = node.value;
    if (patterns.some((p) => p.test(value))) {
      const newValue = patterns.reduce((v, p) => v.replace(p, "%"), value);
      console.log("replace", node.value, "with", value);
      return {
        ...node,
        value: newValue,
      };
    }
  }
};
