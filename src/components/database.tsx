import { init, InstantClient, tx } from "@instantdb/core";

export let db: InstantClient<Schema, RoomSchema>;

if (typeof window !== "undefined") {
  db = init<Schema, RoomSchema>({
    appId: import.meta.env.VITE_INSTANTDB_APP_ID,
    devtool: false,
  });
  window.addEventListener("beforeunload", () => {
    db.shutdown();
  });
}
