import { batch, createSignal, Show } from "solid-js";
import { email, setEmail, setFlow, setOpen } from "./authflow";
import { db } from "~/components/database";
import Button from "~/components/Button";
import { Dialog } from "@kobalte/core/dialog";

export default function RequireEmail() {
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
          <div class="c-description">We will send a code to this email</div>

          <Show when={error()}>
            <div class="c-description !text-red-500">{error()}</div>
          </Show>

          <div class="el border shadow-lg rounded-lg overflow-hidden">
            <input
              value={email()}
              onInput={(e) => {
                setEmail(e.currentTarget.value);
              }}
              placeholder="Email"
              class="outline-none  
          min-w-0 
          px-4 py-2
          placeholder-zinc-500
          text-sm caret-zinc-500 bg-transparent"
            />
          </div>
        </div>
      </div>

      <div class="p-4 bg-zinc-970 border-t flex flex-row-reverse items-center space-x-2 space-x-reverse">
        <Button
          disabled={!email()}
          onClick={async () => {
            try {
              const _email = email();
              if (!_email) return;
              await db.auth.sendMagicCode({ email: _email });
              setFlow("code");
            } catch (e) {
              console.error(e);
              setError("Error: Invalid email");
            }
          }}
          class="btn btn-inverted"
        >
          Send code
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
