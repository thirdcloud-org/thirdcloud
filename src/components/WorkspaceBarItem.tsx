import { createSignal, For, Show } from "solid-js";

import { id, tx } from "@instantdb/core";
import { Dialog } from "@kobalte/core/dialog";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { BsChevronExpand, BsPlusLg } from "solid-icons/bs";
import Button from "~/components/Button";
import { db } from "~/components/database";

import { createStore } from "solid-js/store";
import { profile } from "~/global";
import { showToast } from "~/toast";
import {
  selectedWorkspace,
  setSelectedWorkspaceId,
  workspaces,
} from "./workspace";

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
  const colors = [
    "#fe776a",
    "#fcbc53",
    "#ffe55c",
    "#6eff80",
    "#369cff",
    "#a77ab8",
  ];
  const [store, setStore] = createStore<Partial<Workspace>>({
    name: "",
  });

  const [open, setOpen] = createSignal(false);
  return (
    <>
      <Dialog open={open()} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay class="dialog__overlay" />
          <div class="dialog__positioner">
            <Dialog.Content class="dialog__content">
              <div class="p-4 space-y-6">
                <div class="dialog__header">
                  <Dialog.Title class="font-semibold text-xl">
                    Create a new workspace
                  </Dialog.Title>
                </div>

                <div
                  class="overflow-auto space-y-6"
                  style={{
                    "max-height": "calc(100vh - 200px)",
                    "scrollbar-width": "thin",
                    "scrollbar-color": "#333 transparent",
                  }}
                >
                  <div class="space-y-2">
                    <div class="font-medium">Name</div>
                    <input
                      value={store.name}
                      onInput={(e) => {
                        setStore("name", e.target.value);
                      }}
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <div class="p-4 bg-neutral-970 border-t flex flex-row-reverse items-center space-x-2 space-x-reverse">
                <Button
                  onClick={async () => {
                    const profile_id = profile().id;
                    const workspace = {
                      ...store,
                      color: colors[Math.floor(Math.random() * colors.length)],
                    };
                    const result = await db.transact([
                      tx.workspaces[id()].update(workspace).link({
                        profiles: profile_id,
                      }),
                    ]);
                    console.log("created new workspace", result, profile_id);

                    showToast({
                      title: `Workspace "${workspace.name}" created`,
                      description: "You can now switch to it.",
                      type: "success",
                    });
                    setOpen(false);
                  }}
                  class="btn btn-inverted"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                  class="btn flex-none"
                >
                  Cancel
                </Button>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog>

      <DropdownMenu>
        <DropdownMenu.Trigger class="py-1 px-2 select-none flex items-center space-x-1 text-neutral-500 hover:text-white duration-150">
          <Show
            fallback={<BsChevronExpand class="w-3 h-3" />}
            when={selectedWorkspace()}
          >
            {(w) => <WorkspaceIcon w={w()} size={12} />}
          </Show>

          <div class="max-w-28 truncate">
            {selectedWorkspace()?.name ?? "No Workspace"}
          </div>
        </DropdownMenu.Trigger>

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
                          setSelectedWorkspaceId(w.id);
                          setOpen(false);
                        }}
                        data-selected={w.id == selectedWorkspace()?.id}
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
