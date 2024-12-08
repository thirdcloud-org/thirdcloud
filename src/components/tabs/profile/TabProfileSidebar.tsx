import { createSignal, For } from "solid-js";
import { selectedAppId } from "~/components/apps";

export default function TabProfileSidebar() {
  const [selectedTabId, setSelectedTabId] = createSignal<string>();
  const tabs = [
    {
      id: "profile",
      name: "Profile",
    },
    {
      id: "notification",
      name: "Notification",
    },
  ];

  return (
    <div class="overflow-y-auto overflow-x-hidden flex-1">
      <div class="flex items-center space-x-4 justify-between mx-4  ">
        <div class="header py-4 ">Settings</div>
      </div>

      <div>
        <For each={tabs}>
          {(m) => {
            return (
              <div
                onClick={() => {
                  if (selectedTabId() == m.id) {
                    setSelectedTabId();
                    return;
                  }
                  setSelectedTabId(m.id);
                }}
                data-selected={selectedTabId() == m.id}
                class="flex items-center cursor-pointer space-x-4 mx-2 px-2 rounded py-2 v-hover-highlight-sidebar"
              >
                <div class="line-clamp-1 leading-none">{m.name}</div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
