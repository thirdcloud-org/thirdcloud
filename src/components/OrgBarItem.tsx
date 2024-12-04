import { createSignal, For, Show } from "solid-js";

import { tx } from "@instantdb/core";
import { Dialog } from "@kobalte/core/dialog";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { BsBuildingFill, BsPlusLg } from "solid-icons/bs";
import { VsLoading, VsPassFilled } from "solid-icons/vs";
import Button from "~/components/Button";
import { db } from "~/components/database";
import { orgs, selectedOrg } from "./orgs";
import { sortedTasks } from "./tasks";
import { createStore } from "solid-js/store";

type Organization = any;

export default function OrgBarItem() {
  const [store, setStore] = createStore<Partial<Organization>>({
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
                    Create a new organization
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

                  <For each={store.contacts}>
                    {(c, i) => (
                      <div class="space-y-2">
                        <div class="font-medium">Phone number</div>
                        <input
                          value={c.value}
                          onInput={(e) => {
                            setStore("contacts", i(), "value", e.target.value);
                          }}
                          class="form-input"
                        />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <div class="p-4 bg-zinc-970 border-t flex flex-row-reverse items-center space-x-2 space-x-reverse">
                <Button
                  onClick={async () => {
                    // const result = await db.transact([
                    //   tx.profiles[_user().id].update(store),
                    // ]);
                    // console.log("update profile result", result);
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
        <DropdownMenu.Trigger class="py-1 px-2 select-none flex items-center space-x-1 text-zinc-500 hover:text-white duration-150">
          <BsBuildingFill class="w-3 h-3" />
          <div class="max-w-28 truncate">
            {selectedOrg()?.name ?? "No Organization"}
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
              <div>Organizations</div>

              <BsPlusLg class="w-4 h-4" />
            </div>

            <div class="max-w-[300px]">
              <Show
                when={orgs().length > 0}
                fallback={
                  <div class="p-2 px-4 ">
                    <span class="text-sm">
                      It looks like you’re not part of any organization yet
                    </span>
                  </div>
                }
              >
                <div class="max-h-52 nice-scrollbar">
                  <For each={sortedTasks()}>
                    {(task) => (
                      <div
                        class="p-2 px-4 flex items-center space-x-2  data-[completed=false]:animate-pulse max-w-sm overflow-hidden"
                        data-completed={task.completed ? true : false}
                      >
                        <div class="flex-none">
                          <Show
                            when={task.completed}
                            fallback={
                              <VsLoading class="w-4 h-4 animate-spin" />
                            }
                          >
                            <VsPassFilled class="w-4 h-4" />
                          </Show>
                        </div>
                        <div class="text-sm truncate">{task.description}</div>
                      </div>
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
