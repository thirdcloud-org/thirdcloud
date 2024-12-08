import { marked } from "marked";
import { For, JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  installationOf,
  appMetas,
  mkButton,
  selectedAppId,
} from "~/components/apps";
import Icon from "~/components/Icon";

function AppView(props: { app: AppMeta }) {
  const html = () => marked.parse(props.app.readme) as string;

  return (
    <div>
      <div class="flex items-start space-x-4">
        <div class="flex-none">
          <Icon src={props.app.icon} size="lg" />
        </div>
        <div class="flex-1">
          <div class="py-2 space-y-0.5">
            <div class="font-bold text-2xl">{props.app.name}</div>

            <div class="c-description">{props.app.description}</div>
            <div class="line-clamp-1 c-description !text-blue-500">
              {props.app.author_name}
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Show
              fallback={mkButton("install")(props.app)}
              when={installationOf(props.app.id)}
            >
              {(installation) => (
                <>
                  {mkButton("remove")(props.app)}
                  {installation().disabled
                    ? mkButton("enable")(props.app)
                    : mkButton("disable")(props.app)}
                </>
              )}
            </Show>
          </div>
        </div>
      </div>

      <div class="divider my-4" />
      <div class="flex flex-wrap gap-2">
        <For each={props.app.categories}>
          {(e) => <div class="border  px-2 py-1 text-sm">{e}</div>}
        </For>
      </div>

      <div class="divider my-4" />
      <div class="flex flex-start space-x-2 ">
        <div
          class="prose prose-invert prose-neutral text-white max-w-none flex-1 "
          innerHTML={html()}
        />
      </div>
    </div>
  );
}

export default function TabAddBody() {
  const app = () => appMetas.find((e) => e.id == selectedAppId());

  return (
    <div class="p-6  flex-1">
      <Show when={app()}>{(a) => <AppView app={a()} />}</Show>
    </div>
  );
}
