import { ModuleSource } from "@endo/module-source";
import { VirtualEnvironment } from "@locker/near-membrane-base";
import "ses";
import { createSESVirtualEnvironment } from "../ses-membrane";

import {
  getResolvePathFunction,
  installationOf,
  proxyFetch,
} from "~/components/apps";
import { transform } from "./transform";
import { createSignal } from "solid-js";
import { profile } from "~/global";

declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

const createModuleSource = (specifier: string, code: string) => {
  const transformedCode = transform(specifier, code);
  const moduleSource = new ModuleSource(transformedCode);
  return { moduleSource, transformedCode };
};

function isHTML(input: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");

    // If there are no valid nodes, it might not be HTML.
    return doc.body.children.length > 0;
  } catch (e) {
    return false;
  }
}

export type Distortion = Map<any, () => any>;
export class Sandbox {
  private shadowRoot: ShadowRoot | undefined;
  private env: VirtualEnvironment | undefined;
  private revoke: (() => void) | undefined;
  private distortion: Distortion | undefined;
  private compartment: Compartment | undefined;
  private resolvePath: ResolvePath | undefined;

  // private shadowRootProxy: ShadowRoot | undefined;
  private modules = new Map<
    string,
    {
      source?: ModuleSource;
    }
  >();

  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
      errorTaming: "unsafe-debug",
    });
  }

  constructor(
    public id: string,
    public permissions: {
      allow_page_reload: boolean;
    }
  ) {
    Sandbox.lockdown();
  }

  async fetch(importSpecifier: string) {
    if (!this.resolvePath) throw new Error("resolvePath not initialized");
    const path = this.resolvePath(importSpecifier);
    return await proxyFetch(path);
  }

  getCachedModule(specifier: string) {
    const cached = this.modules.get(specifier);

    if (cached) {
      return {
        source: cached.source,
        specifier,
        compartment: this.compartment, // reflexive
      };
    }
  }

  // lazily init when shadowRoot and stuffs have been all setup
  public init() {
    // const fetchWithNamespace = harden((...args: any[]) => {
    //   const url = args[0];

    //   if (typeof url === 'string' && url.startsWith('https://')) {
    //     const namespace = this.options.id;
    //     console.log('Original URL:', url);
    //     const originalParam = encodeURIComponent(url)
    //     const modifiedUrl = new URL(`${window.location.protocol}//${window.location.host}/app/${namespace}`);
    //     modifiedUrl.searchParams.set('original', originalParam);

    //     console.log('Modified URL:', modifiedUrl);
    //     return fetch(modifiedUrl, ...args.slice(1));
    //   }

    //   console.log('URL did not match criteria for modification:', url);
    //   return fetch(url, ...args.slice(1));
    // });
    // const source = createModuleSource(VITE_CLIENT_MJS);
    // this.modules.set("/@vite/client", { source });
    // this.modules.set("@vite/client", { source });
    // this.modules.set("/src//@vite/client", { source });
    // this.modules.set("http://localhost:5173/@vite/client", { source });

    const ins = installationOf(this.id);
    if (!ins) throw new Error("No installation found for " + this.id);

    const { resolvePath, indexPath } = getResolvePathFunction(ins.meta.index);
    this.resolvePath = resolvePath;
    const this_sandbox = this;

    const compartment = new Compartment({
      __options__: true,
      id: this.id,
      globals: {
        host: {
          users: [],
          profile,
        },
        $host_import_meta: {
          url: (specifier: string) => {
            const url = new URL(specifier, "http://localhost:5173").toString();
            return url;
          },
          resolve: (specifier: string) => {
            throw new Error(
              "resolve not implemented, called with " + specifier
            );
          },
        },
        $host_dynamic_import: async (dep: string) => {
          console.log("start import...", dep);
          const { namespace } = await compartment.import(dep);

          const descDefault = Object.getOwnPropertyDescriptor(
            namespace,
            "default"
          )!;
          console.log(
            "$host_dynamic_import",
            dep,
            namespace,
            descDefault,
            descDefault.value,
            descDefault.get
          );

          // await new Promise(r => setTimeout(r, 1000));
          const obj = Object.create(null);
          for (const key in namespace) {
            obj[key] = namespace[key];
          }

          return obj;
        },
        Math,
      },
      // modules: {
      //   'submodule/dependency': new ModuleSource(`
      //     export default 42;
      //   `),
      // },
      // moduleMapHook(moduleSpecifier: string) {
      //     console.log('moduleMapHook >', 'moduleSpecifier', moduleSpecifier);
      //     return undefined
      // },
      importHook: async (
        importSpecifier: string,
        referrerSpecifier: string
      ) => {
        console.log("importHook", importSpecifier);
        const cached = this_sandbox.getCachedModule(importSpecifier);
        if (cached) return cached;
        const code = await this_sandbox.fetch(importSpecifier);
        const { moduleSource } = createModuleSource(importSpecifier, code);
        return {
          source: moduleSource,
          specifier: importSpecifier,
          compartment: this.compartment,
        };
      },
      importNowHook(importSpecifier: string, referrerSpecifier: string) {
        console.log("importNowHook", importSpecifier);
        const module = this_sandbox.fetch(importSpecifier);
        this.modules.set(importSpecifier, module);
        return module;
      },
      /**
       * Resolve a module specifier relative to another module specifier.
       *
       * For example, if we're currently inside a module at `a/b/c.mjs` and we
       * want to import `./d.mjs`, we need to resolve the specifier `./d.mjs`
       * relative to the current module specifier `a/b/c.mjs`.
       *
       * The result of this resolution is `a/b/d.mjs`, which is the full module
       * specifier of the module that we want to import.
       *
       * This hook is used to implement the `import` statement in our sandboxed
       * environment.
       *
       * @param referrerSpecifier - The specifier of the module that we're
       * currently inside of.
       * @param importSpecifier - The specifier of the module that we want to
       * import.
       * @returns The fully resolved specifier of the module that we want to
       * import.
       */
      resolveHook(importSpecifier: string, referrerSpecifier: string) {
        const baseUrl = new URL(referrerSpecifier, "http://localhost:5173"); // Use a dummy base, could very well be http://example.com, only at this place
        const resolvedUrl = new URL(importSpecifier, baseUrl);
        const result = resolvedUrl
          .toString()
          .replace(/^http:\/\/example\.com\//, "");
        console.log(
          "resolve",
          importSpecifier,
          referrerSpecifier,
          "to",
          result
        );
        return result;
      },

      // importMetaHook: (_moduleSpecifier: string, meta: any) => {
      //   const url = new URL(
      //     _moduleSpecifier,
      //     "http://localhost:5173"
      //   ).toString();
      //   console.log("importMetaHook", {
      //     url,
      //     _moduleSpecifier,
      //     meta,
      //   });
      //   meta.url = url;
      // },
    });

    this.compartment = compartment;

    const { env, revoke } = createSESVirtualEnvironment(window, compartment, {
      distortionCallback(v) {
        if (!this_sandbox.distortion)
          throw new Error("distortion not initialized");

        const distorted_v = this_sandbox.distortion.get(v as any);
        return distorted_v ?? v;
      },
      globalObjectShape: window,
      endowments: Object.getOwnPropertyDescriptors({}),

      liveTargetCallback(target, targetTraits) {
        // Is this the right way to let style be updated?
        // Relevant: https://github.com/salesforce/near-membrane/blob/8fd3afa433888438951dda1c709f96a967f0bcbe/test/dom/live-object.spec.js#L13
        // https://github.com/salesforce/near-membrane/issues/433
        return target instanceof CSSStyleDeclaration;
      },
    });

    this.env = env;
    this.revoke = revoke;

    return this.compartment;
  }

  evaluate(code: string) {
    const compartment = this.compartment ?? this.init();
    return compartment.evaluate(code, {
      __evadeHtmlCommentTest__: true,
      // __evadeImportExpressionTest__: true
    });
  }

  cacheModule(specifier: string, code: string) {
    const { moduleSource } = createModuleSource(specifier, code);
    this.modules.set(specifier, {
      source: moduleSource,
    });
  }

  importNow(specifier: string) {
    // if (
    //   specifier == "/@vite/client" ||
    //   specifier == "/src//@vite/client" ||
    //   specifier == "@vite/client" ||
    //   specifier == "http://localhost:5173/@vite/client"
    // ) {
    //   console.warn("Skipping import of vite client");
    //   return;
    // }

    try {
      const compartment = this.compartment ?? this.init();
      const namespace = compartment.importNow(specifier);
      return namespace;
    } catch (error) {
      console.error(error);
    }
  }

  import(specifier: string) {
    // if (specifier == "/@vite/client" || specifier == "/src//@vite/client") {
    //   console.warn("Skipping import of vite client");
    //   return;
    // }

    try {
      const compartment = this.compartment ?? this.init();
      const namespace = compartment.import(specifier);
      return namespace;
    } catch (error) {
      console.error(error);
    }
  }

  setShadowRoot(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
    this.buildDistortion();
  }

  buildDistortion() {
    const { get: host } = Object.getOwnPropertyDescriptor(
      ShadowRoot.prototype,
      "host"
    )!;

    const { get: body } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "body"
    )!;

    const { value: getElementById } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "getElementById"
    )!;

    const { value: querySelector } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "querySelector"
    )!;

    const { value: reload } = Object.getOwnPropertyDescriptor(
      location,
      "reload"
    )!;

    const { get: head } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "head"
    )!;

    const imageSrcDesc = Object.getOwnPropertyDescriptor(
      Image.prototype,
      "src"
    )!;
    const imageSrcSet = imageSrcDesc.set!;

    const distortion: Distortion = new Map([
      [
        alert,
        () => {
          console.error("forbidden");
        },
      ],
      [
        body,
        () => {
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.getElementById("body");
        },
      ],
      [
        host,
        () => {
          console.error("host is not accessible");
        },
      ],
      [
        getElementById,
        (...args: any[]) => {
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.getElementById(
            // @ts-ignore
            ...args
          );
        },
      ],
      [
        querySelector,
        (...args: any[]) => {
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.querySelector(
            // @ts-ignore
            ...args
          );
        },
      ],
      [
        reload,
        this.permissions.allow_page_reload
          ? () => {
              location.reload();
            }
          : async () => {
              console.error("forbidden");
            },
      ],
      [
        head,
        () => {
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.getElementById("head");
        },
      ],
      [
        imageSrcSet,
        function (this: HTMLImageElement, path: string) {
          const url = new URL(path, "http://localhost:5173").toString();
          imageSrcSet.bind(this)(url);
        },
      ],
    ]);

    this.distortion = distortion;
  }

  destroy() {
    this.revoke?.();
    this.compartment = undefined;
    this.env = undefined;
    this.distortion = undefined;
    this.modules.clear();
    this.shadowRoot = undefined;
  }
}

// compartment.import {
// const module_source = importHook()
// magic
// return namespace
// namespace is stupid (get not value)
// }
// importHook return ModuleSource
