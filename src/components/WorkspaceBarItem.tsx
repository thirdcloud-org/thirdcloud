import { createSignal, For, Show } from "solid-js";

import { id, tx } from "@instantdb/core";
import { Dialog } from "@kobalte/core/dialog";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { BsChevronExpand, BsPlusLg } from "solid-icons/bs";
import Button from "~/components/Button";
import { db } from "~/components/database";

import { createStore } from "solid-js/store";
import { profile, profileJwtToken } from "~/global";
import { showToast } from "~/toast";
import {
  selectedWorkspace,
  selectedWorkspaceId,
  workspaces,
} from "./workspace";
import { profile_create_workspace } from "~/server";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

function WorkspaceIcon(props: { w: Workspace; size: number }) {
  return (
    <div
      class="rounded-full "
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        "background-color": props.w.color,
      }}
    />
  );
}

export default function WorkspaceBarItem() {
  const [store, setStore] = createStore<Partial<Workspace>>({
    name: "",
  });

  const [open, setOpen] = createSignal(false);
  return (
    <>
      <CreateWorkspaceDialog open={open} setOpen={setOpen} />

      <DropdownMenu>
        <Show when={selectedWorkspace()}>
          {(w) => (
            <DropdownMenu.Trigger class="py-1 px-2 select-none flex items-center space-x-1 text-neutral-500 hover:text-white duration-150">
              <WorkspaceIcon w={w()} size={12} />

              <div class="max-w-28 truncate">{w().name}</div>
            </DropdownMenu.Trigger>
          )}
        </Show>

        <DropdownMenu.Portal>
          <DropdownMenu.Content class="dropdown-menu__content max-h-60 overflow-auto nice-scrollbar">
            <div
              onClick={() => {
                setOpen(true);
              }}
              class="px-4 py-2 flex items-center space-x-1 hover:text-white header c-description duration-150 cursor-pointer"
            >
              <div>Workspaces</div>

              <BsPlusLg class="w-4 h-4" />
            </div>

            <div class="max-w-[300px]">
              <Show
                when={workspaces().length > 0}
                fallback={
                  <div class="p-2 px-4 ">
                    <span class="text-sm">
                      You don&apos;t have any workspaces yet
                    </span>
                  </div>
                }
              >
                <div class="max-h-52 nice-scrollbar">
                  <For each={workspaces()}>
                    {(w) => (
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("workspace", w.id);
                          window.location.href = url.toString();
                          setOpen(false);
                        }}
                        data-selected={w.id == selectedWorkspaceId()}
                        class="w-full p-2 px-4 flex items-center space-x-2  max-w-sm overflow-hidden hover:bg-neutral-900 data-[selected=true]:bg-[#6321f2] rounded"
                      >
                        <div class="flex-none">
                          <WorkspaceIcon w={w} size={16} />
                        </div>
                        <div class="text-sm truncate">{w.name}</div>
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </>
  );
}
