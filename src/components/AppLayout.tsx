import { children, JSX, Show } from "solid-js";

export default function AppLayout(props: {
  showSidebar?: boolean;
  sidebar?: JSX.Element;
  children?: JSX.Element;
}) {
  return (
    <div class="flex items-start h-full">
      <Show when={props.showSidebar}>
        <div class="w-80 h-full border-r  overflow-y-auto overflow-x-hidden nice-scrollbar">
          {props.sidebar}
        </div>
      </Show>

      <div class="h-full flex-1 overflow-y-auto overflow-x-hidden nice-scrollbar">
        {props.children}
      </div>
    </div>
  );
}
