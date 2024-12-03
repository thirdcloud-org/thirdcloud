import localforage from "localforage";

export let cachedInstallations: LocalForage;

if (typeof window !== "undefined") {
  cachedInstallations = localforage.createInstance({
    name: "host_installations",
  });
}
