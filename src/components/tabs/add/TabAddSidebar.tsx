import { ImSearch } from "solid-icons/im";
import { createSignal, onMount } from "solid-js";
import { For } from "solid-js/web";
import {
  installationOf,
  appMetas,
  mkButton,
  selectedAppId,
  setSelectedAppId,
} from "~/components/apps";
import Button from "~/components/Button";
import Icon from "~/components/Icon";

export default function TabAddSidebar() {
  let input: HTMLInputElement;
  const [isSearching, setIsSearching] = createSignal(false);
  onMount(() => {
    setSelectedAppId(appMetas[0].id);
  });

  return (
    <div class="overflow-y-auto overflow-x-hidden flex-1">
      <div class="flex items-center space-x-4 justify-between mx-4  ">
        <div class="header py-4 ">apps</div>
        {/* <div data-show={!isSearching()} class="flex-1 hidden data-[show=true]:block" /> */}
        <div
          data-show={isSearching()}
          class="my-2 flex-none data-[show=true]:flex-1 flex items-stretch el border shadow-lg rounded-lg overflow-hidden "
        >
          <button
            class="flex-none p-2"
            onClick={() => {
              setIsSearching(true);
              input!.focus();
            }}
          >
            <ImSearch class="w-4 h-4" />
          </button>
          <input
            ref={input!}
            onBlur={() => {
              setIsSearching(false);
            }}
            data-show={isSearching()}
            placeholder="Search"
            class="outline-none  
            min-w-0 flex-none 
            placeholder-neutral-500
            data-[show=true]:flex-1  w-0 text-sm caret-neutral-500 bg-transparent"
          />
        </div>
      </div>

      <div>
        <For each={appMetas}>
          {(m) => {
            const btn = () => {
              const installation = installationOf(m.id);
              if (installation) {
                if (installation.disabled) {
                  return mkButton("enable");
                }
                return mkButton("remove");
              }
              return mkButton("install");
            };

            return (
              <div
                onClick={() => {
                  // if (selectedAppId() == m.id) {
                  //   setSelectedAppId();
                  //   return;
                  // }
                  setSelectedAppId(m.id);
                }}
                data-selected={selectedAppId() == m.id}
                class="flex items-start cursor-pointer space-x-4 px-4 py-4 v-hover-highlight"
              >
                <Icon src={m.icon} size="md" />

                <div class="flex-1 space-y-1">
                  <div class="font-bold line-clamp-1 leading-none">
                    {m.name}
                  </div>
                  <div class=" line-clamp-1 leading-none c-description">
                    {m.description}
                  </div>
                  <div class="flex items-center w-full ">
                    <div class="flex-1  text-xs line-clamp-1 font-semibold leading-none c-description">
                      {m.author_name}
                    </div>
                    {btn()(m)}
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
