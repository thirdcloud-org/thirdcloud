import { JSX } from "solid-js";

import { Tabs } from "@kobalte/core/tabs";
import { bodyOverlay } from "~/global";
import AppBar from "./AppBar";
import NotificationBarItem from "./NotificationBarItem";
import WorkspaceBarItem from "./WorkspaceBarItem";

export default function Layout(props: { children?: JSX.Element }) {
  return (
    <Tabs
      as="div"
      onMouseMove={bodyOverlay.hideSoon}
      onMouseLeave={bodyOverlay.hideSoon}
      aria-label="Main navigation"
      class="tabs min-h-screen flex items-start"
      orientation="vertical"
    >
      <AppBar />
      <div class="relative h-screen flex-1">
        <div class="h-full v-main flex flex-col border-l overflow-hidden">
          <div class="flex-1 overflow-hidden">{props.children}</div>

          <div class="bg-neutral-930 border-t text-xs flex-none flex items-center flex-row-reverse">
            <WorkspaceBarItem />
            <NotificationBarItem />
          </div>
        </div>
      </div>
    </Tabs>
  );
}
