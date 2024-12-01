import { tx } from "@instantdb/core";
import { createSignal, Show } from "solid-js";
import Button from "~/components/Button";
import { db } from "~/components/database";
import { code, email, setCode } from "./authflow";

export default function RequireCode() {
  const [error, setError] = createSignal("");
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
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
              px-4 py-2
              placeholder-neutral-500
              text-sm caret-neutral-500 bg-transparent"
          />
        </div>

        <Button
          disabled={!code()}
          class="btn btn-sm"
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

                const { data } = await db.queryOnce({
                  profiles: {
                    $: {
                      where: {
                        id: _signin.user.id,
                      },
                    },
                  },
                });

                if (data.profiles[0]) {
                  // Already have profile, no-op
                  console.log("already have profile", data.profiles[0]);
                } else {
                  const result = await db.transact([
                    tx.profiles[_signin.user.id].update({
                      name: "Test User",
                      avatar_url: "",
                      // Create one phone number by default
                      contacts: [
                        {
                          type: "mobile",
                          value: "",
                        },
                      ],
                      description: "",
                      role: "Product Manager",
                    }),
                  ]);
                  console.log("created profile result", result);
                }
              }
            } catch (e) {
              console.error(e);
              setError("Error: Invalid code");
            } finally {
            }
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
