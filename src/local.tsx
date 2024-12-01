import localforage from "localforage";

export let local: LocalForage;
if (typeof window !== "undefined") {
  local = localforage.createInstance({
    name: "ab_installations",
  });
}
