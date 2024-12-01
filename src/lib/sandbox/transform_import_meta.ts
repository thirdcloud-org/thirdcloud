import { Node } from "estree";

export const mk_node_transform_import_meta =
  (specifier: string) =>
  (node: Node): Node | undefined => {
    if (
      node.type === "MemberExpression" &&
      node.object.type === "MetaProperty" &&
      node.object.meta.name === "import" &&
      node.object.property.name === "meta"
    ) {
      const allowedProperties = ["url", "resolve"]; // Only transform these properties
      if (
        node.property.type === "Identifier" &&
        allowedProperties.includes(node.property.name)
      ) {
        const func: Node = {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "$host_import_meta",
            },
            property: node.property,
            computed: node.computed,
            optional: node.optional,
          },
          arguments: [
            {
              type: "Literal",
              value: specifier,
            },
          ],
          optional: false,
        };

        return func;
      }
    }

    // Return the node unchanged if it doesn't match the conditions
    return node;
  };
