import { Dialog } from "@kobalte/core/dialog";
import { BsPencilFill } from "solid-icons/bs";
import { createEffect, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import Button from "~/components/Button";
import { profile, profileJwtToken, setProfile } from "~/global";
import { profile_update } from "~/server";
export default function EditProfileButton() {
  const [store, setStore] = createStore<Partial<Profile>>({});

  createEffect(() => {
    const p = profile();
    setStore(p ?? {});
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
                    Edit your profile
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

                  <div class="space-y-2">
                    <div class="font-medium">Role</div>
                    <input
                      value={store.role}
                      onInput={(e) => {
                        setStore("role", e.target.value);
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
                    const profile_jwt_token = profileJwtToken();
                    if (!profile_jwt_token)
                      throw new Error("Client has no profile_jwt_token");
                    profile_update(profile_jwt_token, store);
                    // Need this because profile could be a guest profile (we have no user)
                    // Hence, not reactivity
                    setProfile({
                      ...profile(),
                      ...store,
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
      <Button
        class="btn btn-sm flex items-center space-x-1.5"
        onClick={() => {
          setOpen(true);
        }}
        icons={{
          idle: BsPencilFill,
        }}
      >
        Edit Profile
      </Button>
    </>
  );
}
