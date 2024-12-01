import escodegen from "escodegen";
import { parseModule } from "esprima-next";
import estraverse from "estraverse";
import { node_transform_HTML_comment } from "./transform_HTML_comment";
import { code_transform_default_destructuring } from "./transform_default_destructuring";
import {
  code_transform_dynamic_import,
  node_transform_dynamic_import,
} from "./transform_dynamic_import";
import { mk_node_transform_import_meta } from "./transform_import_meta";

export const transform = (specifier: string, code: string) => {
  const node_transforms = [
    node_transform_HTML_comment,
    node_transform_dynamic_import,
    mk_node_transform_import_meta(specifier),
  ];

  const code_transforms = [
    code_transform_default_destructuring,
    code_transform_dynamic_import,
  ];

  const ast = parseModule(code);

  try {
    const node = estraverse.replace(ast as any, {
      enter: function (node) {
        return node_transforms.reduce((n, t) => t(n) ?? n, node);
      },
    });

    const newCode = escodegen.generate(node);

    const result = code_transforms.reduce((n, t) => t(n), newCode);

    const regex = /$host_import_meta/g;
    const contextLength = 50;
    const matches = [];

    let match;
    while ((match = regex.exec(result)) !== null) {
      const start = Math.max(0, match.index - contextLength);
      const end = Math.min(
        result.length,
        match.index + match[0].length + contextLength
      );
      matches.push(result.substring(start, end));
    }

    console.log("matches", matches);
    return result;
  } catch (e) {
    console.error("What the heck", e);
    throw new Error(`What the heck ${specifier}`);
  }
};
