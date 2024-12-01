import { createSignal, Show } from "solid-js";
import { email, setEmail, setFlow } from "./authflow";
import { db } from "~/components/database";
import Button from "~/components/Button";

export default function RequireEmail() {
  const [error, setError] = createSignal("");
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
        {/* <BsIncognito class="w-24 h-24 text-neutral-500" />
    <div class="font-medium text-lg">
      Verify your email
    </div> */}

        <div class="c-description">
          Enter your email to receive a one-time pass code
        </div>

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
          placeholder-neutral-500
          text-sm caret-neutral-500 bg-transparent"
          />
        </div>

        <Button
          disabled={!email()}
          class="btn btn-sm"
          onClick={async () => {
            try {
              const _email = email();
              if (!_email) return;
              await db.auth.sendMagicCode({ email: _email });
              setFlow("code");
            } catch (e) {
              console.error(e);
              setError("Error: Invalid email");
            } finally {
            }
          }}
        >
          Send Code
        </Button>
      </div>
    </div>
  );
}
