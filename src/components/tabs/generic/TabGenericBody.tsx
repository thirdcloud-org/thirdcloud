import { onCleanup, onMount } from "solid-js";
import { appMetas, installationOf, onUIReady } from "~/components/apps";

export default function TabGenericBody(props: { app_id: string }) {
  const installation = installationOf(props.app_id);
  const AppMeta = appMetas.find((AppMeta) => AppMeta.id == props.app_id);

  if (!AppMeta || !installation) {
    return <div>Not found</div>;
  }

  let shadow: HTMLDivElement;
  onMount(async () => {
    const shadowRoot = shadow.attachShadow({ mode: "closed" });
    onUIReady(installation.id, shadowRoot);
  });

  onCleanup(() => {
    console.log("me destroyed!");
  });

  return <div ref={shadow!} class="w-full h-full" />;
}
