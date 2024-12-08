import { tx } from "@instantdb/core";
import { batch, createSignal, Show } from "solid-js";
import Button from "~/components/Button";
import { db } from "~/components/database";
import { code, email, setCode } from "./authflow";

import { Dialog } from "@kobalte/core/dialog";
import { setFlow, setOpen } from "./authflow";
import { profile, setProfile } from "~/global";
import { showToast } from "~/toast";

export default function RequireCode() {
  const [error, setError] = createSignal("");

  return (
    <>
      <div class="p-4 space-y-6">
        <div class="dialog__header">
          <Dialog.Title class="font-semibold text-xl">Sign In</Dialog.Title>
        </div>

        <div
          class="overflow-auto space-y-2"
          style={{
            "max-height": "calc(100vh - 200px)",
            "scrollbar-width": "thin",
            "scrollbar-color": "#333 transparent",
          }}
        >
          <div class="c-description">
            Check your email {email()} for a 6-digit code.
          </div>

          <Show when={error()}>
            <div class="c-description !text-red-500">{error()}</div>
          </Show>

          <div class="el border shadow-lg rounded-lg overflow-hidden">
            <input
              value={code()}
              onInput={(e) => {
                setCode(e.currentTarget.value);
              }}
              placeholder="XXXXXX"
              class="outline-none  
              min-w-0
              w-full 
              px-4 py-2
              placeholder-zinc-500
              text-sm caret-zinc-500 bg-transparent"
            />
          </div>
        </div>
      </div>

      <div class="p-4 bg-zinc-970 border-t flex flex-row-reverse items-center space-x-2 space-x-reverse">
        <Button
          disabled={!code()}
          onClick={async () => {
            try {
              const _email = email();
              if (!_email) return;
              const _code = code();
              if (!_code) return;

              const _signin = await db.auth.signInWithMagicCode({
                email: _email,
                code: _code,
              });
              if (_signin.user) {
                console.log("_signin", _signin);

                // const { data } = await db.queryOnce({
                //     profiles: {
                //       $: {
                //         where: {
                //           '$users.id': _signin.user.id,
                //         },
                //       },
                //     },
                //   });

                //   const p = data.profiles.at(0);
                //   if (p) {
                //     // no-op, let Auth component load the correct profile (again)
                //   } else {
                //     // link
                //     const p = profile();
                //     const result = await db.transact([
                //       tx.profiles[_signin.user.id].update(p as any),
                //     ]);
                //     console.log("created profile result", result);
                //   }

                // const { data } = await db.queryOnce({
                //   profiles: {
                //     $: {
                //       where: {
                //         id: _signin.user.id,
                //       },
                //     },
                //   },
                // });

                // if (data.profiles[0]) {
                //   // Already have a user linked to this profile
                //   // no-op, let Auth component reactively update _profile
                //   console.log("already have profile", data.profiles[0]);
                // } else {
                //   // link
                //   // const p = profile();
                //   // const result = await db.transact([
                //   //   tx.profiles[_signin.user.id].update(p as any),
                //   // ]);
                //   // console.log("created profile result", result);
                // }

                showToast({
                  title: "Signed In",
                  description: "Successfully signed in",
                  type: "success",
                });
                setOpen(false);
              }
            } catch (e) {
              console.error(e);
              setError("Error: Invalid code");
            }
          }}
          class="btn btn-inverted"
        >
          Sign In
        </Button>
        <Button
          onClick={() => {
            batch(() => {
              setOpen(false);
              setFlow("email");
            });
          }}
          class="btn flex-none"
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
