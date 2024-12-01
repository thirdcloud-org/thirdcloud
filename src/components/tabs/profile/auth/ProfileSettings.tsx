import { tx } from "@instantdb/core";
import {
  BsEnvelopeAtFill,
  BsGearFill,
  BsIncognito,
  BsPencilFill,
  BsPenFill,
  BsTelephoneFill,
  BsX,
  BsXLg,
} from "solid-icons/bs";
import { createEffect, createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { db, Profile } from "~/components/database";
import { profile, user } from "~/global";
import { Dialog } from "@kobalte/core/dialog";
import { createStore } from "solid-js/store";
import Button from "~/components/Button";
import { VsLoading } from "solid-icons/vs";

export default function ProfileSettings() {
  const [store, setStore] = createStore<Partial<Profile>>({});

  createEffect(() => {
    const p = profile();
    setStore(p ?? {});
  });

  const [open, setOpen] = createSignal(false);

  return (
    <Show when={user()}>
      {(_user) => (
        <Show when={profile()}>
          {(_profile) => (
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
                                    setStore(
                                      "contacts",
                                      i(),
                                      "value",
                                      e.target.value
                                    );
                                  }}
                                  class="form-input"
                                />
                              </div>
                            )}
                          </For>
                        </div>
                      </div>

                      <div class="p-4 bg-neutral-970 border-t flex flex-row-reverse items-center space-x-2 space-x-reverse">
                        <Button
                          onClick={async () => {
                            const result = await db.transact([
                              tx.profiles[_user().id].update(store),
                            ]);
                            console.log("update profile result", result);
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

              <div class="flex-1">
                <div class="bg-neutral-800 h-48"></div>

                <div class="px-6 pb-6 -translate-y-6 space-y-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-40 h-40 rounded-full  border overflow-hidden">
                      <img
                        src="/default-avatar.svg"
                        class="min-w-full min-h-full bg-neutral-930"
                      />
                    </div>

                    <div class="space-y-2">
                      <div class="space-y-0.5">
                        <div class="font-bold text-2xl">{_profile().name}</div>
                        <div class="c-description">{_profile().role}</div>
                      </div>

                      <div class="flex items-center space-x-2">
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
                        <Button
                          class="btn btn-sm"
                          onClick={() => db.auth.signOut()}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 border rounded-lg space-y-2">
                    <div class="font-semibold">Contact information</div>

                    <div class="flex items-start space-x-4">
                      <div class="p-2 bg-neutral-900 border rounded">
                        <BsEnvelopeAtFill class="w-6 h-6 text-neutral-500" />
                      </div>
                      <div>
                        <div class="text-sm text-neutral-400">Email</div>
                        <div>{_user().email}</div>
                      </div>
                    </div>

                    <For each={_profile().contacts}>
                      {(c) => (
                        <div class="flex items-start space-x-4">
                          <div class="p-2 bg-neutral-900 border rounded">
                            <BsTelephoneFill class="w-6 h-6 text-neutral-500" />
                          </div>
                          <div>
                            <div class="text-sm text-neutral-400">
                              Phone number
                            </div>
                            <Show
                              fallback={<div class="c-description">N/A</div>}
                              when={c.value}
                            >
                              {(v) => <div>{v()}</div>}
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </>
          )}
        </Show>
      )}
    </Show>
  );
}
