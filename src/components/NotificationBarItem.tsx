import { For, Show } from "solid-js";

import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { BsBellFill } from "solid-icons/bs";
import { VsLoading, VsPassFilled } from "solid-icons/vs";
import { sortedTasks } from "./tasks";

export default function NotificationBarItem() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger class="py-1 px-2 select-none flex items-center space-x-1 text-neutral-500 hover:text-white duration-150">
        <BsBellFill class="w-3 h-3" />
        <div class="max-w-28 truncate">
          {sortedTasks().at(0)?.description ?? "All clear"}
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content class="dropdown-menu__content max-h-60 overflow-auto nice-scrollbar">
          <div class="header c-description px-4 py-2">Notifications</div>

          <div class="max-w-[300px]">
            <Show
              when={sortedTasks().length > 0}
              fallback={
                <div class="p-2 px-4 ">
                  <span class="text-sm">All clear—no new notifications!</span>
                </div>
              }
            >
              <div class="max-h-52 nice-scrollbar max-w-md">
                <For each={sortedTasks()}>
                  {(task) => (
                    <div
                      class="p-2 px-4 flex items-center space-x-2  data-[completed=false]:animate-pulse max-w-sm overflow-hidden"
                      data-completed={task.completed ? true : false}
                    >
                      <div class="flex-none">
                        <Show
                          when={task.completed}
                          fallback={<VsLoading class="w-4 h-4 animate-spin" />}
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
  );
}
