import type { Connector } from "@locker/near-membrane-base";
import {
  assignFilteredGlobalDescriptorsFromPropertyDescriptorMap,
  createBlueConnector,
  createRedConnector,
  getFilteredGlobalOwnKeys,
  linkIntrinsics,
  VirtualEnvironment,
} from "@locker/near-membrane-base";
import { BrowserEnvironmentOptions } from "@locker/near-membrane-dom";
import type { ProxyTarget } from "@locker/near-membrane-shared";
import {
  ObjectAssign,
  toSafeWeakMap,
  toSafeWeakSet,
  TypeErrorCtor,
  WeakMapCtor,
  WeakSetCtor,
} from "@locker/near-membrane-shared";
import { getCachedGlobalObjectReferences } from "./window";
type GlobalObject = Window & typeof globalThis;

const revoked = toSafeWeakSet(new WeakSetCtor<GlobalObject | Node>());
const blueCreateHooksCallbackCache = toSafeWeakMap(
  new WeakMapCtor<Document, Connector>()
);

export function createSESVirtualEnvironment(
  globalObject: WindowProxy & typeof globalThis,
  redCompartment: Compartment,
  providedOptions?: BrowserEnvironmentOptions
): {
  env: VirtualEnvironment,
  revoke: () => void
} {
  let _revokedAll = false;
  const revoke = () => {
    _revokedAll = true;
  };

  let defaultGlobalOwnKeys: PropertyKey[] | null = null;
  if (typeof globalObject !== "object" || globalObject === null) {
    throw new TypeErrorCtor("Missing global object virtualization target.");
  }
  const {
    distortionCallback,
    endowments,
    globalObjectShape,
    instrumentation,
    liveTargetCallback,
    maxPerfMode = false,
    signSourceCallback,
  } = ObjectAssign(
    { __proto__: null },
    providedOptions
  ) as BrowserEnvironmentOptions;

  if (typeof globalObject !== "object" || globalObject === null) {
    throw new TypeErrorCtor("Missing global object virtualization target.");
  }
  const blueRefs = getCachedGlobalObjectReferences(globalObject);
  if (typeof blueRefs !== "object" || blueRefs === null) {
    throw new TypeErrorCtor("Invalid virtualization target.");
  }

  let blueConnector = blueCreateHooksCallbackCache.get(blueRefs.document) as
    | Connector
    | undefined;
  if (blueConnector === undefined) {
    blueConnector = createBlueConnector(globalObject);
    blueCreateHooksCallbackCache.set(blueRefs.document, blueConnector);
  }

  const redGlobalObject = redCompartment.globalThis;
  const { eval: redIndirectEval } = redGlobalObject;
  const env = new VirtualEnvironment({
    blueConnector,
    revokedProxyCallback: (value: any) => {
      return _revokedAll || revoked.has(value);
    },
    redConnector: createRedConnector(
      signSourceCallback
        ? (sourceText: string) =>
            redIndirectEval(signSourceCallback(sourceText))
        : redIndirectEval
    ),
    distortionCallback,
    instrumentation,
    liveTargetCallback,
    signSourceCallback,
  });
  linkIntrinsics(env, globalObject);

  const shouldUseDefaultGlobalOwnKeys =
    typeof globalObjectShape !== "object" || globalObjectShape === null;
  if (shouldUseDefaultGlobalOwnKeys && defaultGlobalOwnKeys === null) {
    defaultGlobalOwnKeys = getFilteredGlobalOwnKeys(
      redGlobalObject,
      maxPerfMode
    );
  }

  env.lazyRemapProperties(
    globalObject,
    shouldUseDefaultGlobalOwnKeys
      ? (defaultGlobalOwnKeys as PropertyKey[])
      : getFilteredGlobalOwnKeys(globalObjectShape, maxPerfMode)
  );

  if (endowments) {
    const filteredEndowments = {};
    assignFilteredGlobalDescriptorsFromPropertyDescriptorMap(
      filteredEndowments,
      endowments,
      maxPerfMode
    );
    env.remapProperties(globalObject, filteredEndowments);
  }
  return {env, revoke}
}

