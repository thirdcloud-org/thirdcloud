import { deserialize } from "seroval";
import { JSX, onCleanup, onMount } from "solid-js";

import { installations, setInstallations } from "~/components/apps";
import { profile } from "~/global";
import { ls_host_installations } from "~/local";
import { db } from "./database";
import { setWorkspaces } from "./workspace";

export default function MainApp(props: { children?: JSX.Element }) {
  onMount(async () => {
    const keys = await ls_host_installations.keys();
    const serializeds = await Promise.all(
      keys.map((k) => ls_host_installations.getItem(k))
    );
    const _installations = serializeds.map((s) => deserialize(s as string));
    setInstallations(_installations as any[]);
    console.log("_installations", _installations, installations());
  });

  onMount(() => {
    const unsubcribe = db.subscribeQuery(
      {
        workspaces: {
          $: {
            where: {
              "profiles.id": profile().id,
            },
          },
        },
      },
      async (state) => {
        const _workspaces = state.data?.workspaces;
        if (!_workspaces) {
          console.warn("No workspaces found");
          return;
        }

        console.log("workspaces", _workspaces);
        setWorkspaces(_workspaces as Workspace[]);
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  return <div class="animate-fade">{props.children}</div>;
}
