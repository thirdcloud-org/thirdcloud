import localforage from "localforage";

export let ls_host_installations: LocalForage;
export let ls_host: LocalForage;

if (typeof window !== "undefined") {
  ls_host_installations = localforage.createInstance({
    name: "host_installations",
  });

  ls_host = localforage.createInstance({
    name: "host",
  });
}
