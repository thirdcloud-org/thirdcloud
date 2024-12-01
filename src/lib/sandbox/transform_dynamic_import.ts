import { Node } from "estree";

function findImportPatternMatches(src: string) {
  const importPattern = new RegExp(
    "(^|[^.]|\\.\\.\\.)\\bimport(\\s*(?:\\(|/[/*]))",
    "g"
  );

  const matches = [];
  for (const match of src.matchAll(importPattern)) {
    matches.push({
      match: match[0],
      position: match.index,
    });
  }

  return matches;
}

function replaceImportWithThirdCloudImFromMatches(
  src: string,
  matches: ReturnType<typeof findImportPatternMatches>
) {
  let updatedSrc = src;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { position, match } = matches[i];
    const replacement = match.replace(/\bimport/, "$host_dynamic_import");
    updatedSrc =
      updatedSrc.slice(0, position) +
      replacement +
      updatedSrc.slice(position + match.length);
  }
  return updatedSrc;
}

export function node_transform_dynamic_import(node: Node): Node | undefined {
  if (node.type === "ImportExpression") {
    return {
      type: "CallExpression",
      callee: { type: "Identifier", name: "$host_dynamic_import" },
      arguments: [node.source], // Keep the original module source
      optional: false,
    };
  }
}

export function code_transform_dynamic_import(code: string) {
  let result = code;
  const matches = findImportPatternMatches(code);
  if (matches.length > 0) {
    // maybe there's "import(" pattern in comment
    result = replaceImportWithThirdCloudImFromMatches(result, matches);

    // check again
    const matches_after_replace = findImportPatternMatches(result);
    if (matches_after_replace.length > 0) {
      console.error("Cannot fix import", result, matches_after_replace);
      throw new Error("Cannot fix import");
    }
  }

  return result;
}
