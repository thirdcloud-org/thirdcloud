import { deserialize } from "seroval";
import { JSX, onMount } from "solid-js";

import { installations, setInstallations } from "~/components/apps";
import { ls_host_installations } from "~/local";

export default function MainApp(props: { children?: JSX.Element }) {
  onMount(() => {
    (async () => {
      const keys = await ls_host_installations.keys();
      const serializeds = await Promise.all(
        keys.map((k) => ls_host_installations.getItem(k))
      );
      const _installations = serializeds.map((s) => deserialize(s as string));
      setInstallations(_installations as any[]);
      console.log("_installations", _installations, installations());
    })();
  });

  return <div class="animate-fade">{props.children}</div>;
}
