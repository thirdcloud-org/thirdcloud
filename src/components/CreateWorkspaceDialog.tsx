import { Dialog } from "@kobalte/core/dialog";
import { Accessor, Setter, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Button from "./Button";
import { profile, profileJwtToken } from "~/global";
import { profile_create_workspace } from "~/server";
import { showToast } from "~/toast";

export default function CreateWorkspaceDialog(props: {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  compulsory?: boolean;
  onCancel?: () => void;
  onCreated?: (workspace: Partial<Workspace>) => Promise<void>;
}) {
  const [store, setStore] = createStore<Partial<Workspace>>({
    name: "",
  });
  const colors = [
    "#fe776a",
    "#fcbc53",
    "#ffe55c",
    "#6eff80",
    "#369cff",
    "#a77ab8",
  ];

  return (
    <Dialog open={props.open()} onOpenChange={props.setOpen}>
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
                  const jwt_token = profileJwtToken();
                  console.log("jwt_token", jwt_token);

                  const workspace_id = await profile_create_workspace(
                    jwt_token,
                    workspace
                  );

                  console.log(
                    "created new workspace",
                    workspace_id,
                    profile_id
                  );

                  await props.onCreated?.({
                    ...workspace,
                    id: workspace_id,
                  });
                }}
                class="btn btn-inverted"
              >
                Create
              </Button>
              <Show
                fallback={
                  <Button
                    onClick={() => {
                      props.onCancel?.();
                      props.setOpen(false);
                    }}
                    class="btn flex-none"
                  >
                    Cancel
                  </Button>
                }
                when={props.compulsory}
              >
                <></>
              </Show>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}
