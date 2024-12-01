import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { BsPersonFill, BsPlusLg } from "solid-icons/bs";
import { VsLoading, VsPassFilled } from "solid-icons/vs";
import { createEffect, createSignal, For, JSX, onMount, Show } from "solid-js";
import { appMetas, enabledInstallations } from "~/components/apps";
import { activeTabId, setActiveTabId } from "./tabs";
import { sortedTasks } from "./tasks";

function TabsIndicator() {
  const [show, setShow] = createSignal(false);
  let ref: HTMLDivElement;

  createEffect(() => {
    const activeId = activeTabId();
    const activeTab = document.querySelector(
      `[data-tab-trigger-id="${activeId}"]`
    );
    if (!activeTab) return;
    const rect = activeTab.getBoundingClientRect();
    ref.style.top = `${rect.top}px`;
    ref.style.left = `${rect.left - 10}px`;
  });

  onMount(() => {
    const first = document.querySelector("[data-tab-trigger-id]");

    if (!first) return;

    const rect = first.getBoundingClientRect();
    ref.style.top = `${rect.top - 1}px`;
    ref.style.left = `${rect.left - 10}px`;
    const id = first.getAttribute("data-tab-trigger-id")!;
    setActiveTabId(id);
    setShow(true);
  });

  return (
    <div
      ref={ref!}
      data-show={show()}
      class="fixed w-1 rounded-full h-11 bg-white duration-150 hidden data-[show=true]:block"
    />
  );
}

function TabTrigger(props: { children: JSX.Element; id: string }) {
  return (
    <div
      data-tab-trigger-id={props.id}
      onClick={() => {
        console.log("setActiveTabId", props.id);
        setActiveTabId(props.id);
      }}
      data-active={props.id === activeTabId()}
      class="tab-trigger"
    >
      {props.children}
    </div>
  );
}

export default function AppBar() {
  return (
    <div class="flex-none flex flex-col h-screen overflow-y-auto overflow-x-hidden items-center py-4 hide-scrollbar">
      <button
        onClick={() => window.location.reload()}
        class="bar-icon relative"
      >
        <div class=" flex items-center justify-center">
          <img src="/icon.svg" class="w-10 h-10" />
        </div>
      </button>

      <div class="w-full px-4">
        <div class="divider" />
      </div>

      <div class="pl-[1px]">
        <TabTrigger id="add">
          <div class="p-2">
            <BsPlusLg class="w-6 h-6 " />
          </div>
        </TabTrigger>
        <TabTrigger id="profile">
          <div class="p-2">
            <BsPersonFill class="w-6 h-6 " />
          </div>
        </TabTrigger>

        <For each={enabledInstallations()}>
          {(ins) => {
            const app = appMetas.find((m) => m.id == ins.id);
            if (!app) return <></>;
            return (
              <TabTrigger id={ins.id}>
                <img src={app.icon} class="w-10 h-10" />
              </TabTrigger>
            );
          }}
        </For>

        <TabsIndicator />
      </div>
    </div>
  );
}
