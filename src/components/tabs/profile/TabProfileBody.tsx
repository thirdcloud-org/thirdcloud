import { BsEnvelopeFill, BsTelephoneFill } from "solid-icons/bs";
import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import Button from "~/components/Button";
import { db } from "~/components/database";
import EditProfileButton from "~/components/EditProfileButton";
import SignInButton from "~/components/SignInButton";
import {
  profile,
  setAuth,
  setSignedOut,
  signed_in,
  user_contacts,
} from "~/global";
import { ls_host } from "~/local";

function ContactRow(props: { c: Contact }) {
  const ui = {
    mobile: {
      label: "Phone number",
      icon: BsTelephoneFill,
    },
    email: {
      label: "Email",
      icon: BsEnvelopeFill,
    },
  };

  return (
    <div class="flex items-start space-x-4">
      <div class="p-2 bg-neutral-900 border rounded">
        <Dynamic
          component={ui[props.c.type].icon}
          class="w-6 h-6 text-neutral-500"
        />
      </div>
      <div>
        <div class="text-sm text-neutral-400">{ui[props.c.type].label}</div>
        <Show
          fallback={<div class="c-description">N/A</div>}
          when={props.c.value}
        >
          {(v) => <div>{v()}</div>}
        </Show>
      </div>
    </div>
  );
}

export default function TabProfileBody() {
  return (
    <>
      <div class="flex-1">
        <img
          src={profile().banner_src}
          class="h-[33.33vh] max-h-72 w-full object-cover"
        />

        <div class="px-6 pb-6 -translate-y-6 space-y-4">
          <div class="flex items-center space-x-4">
            <div class="w-40 h-40 overflow-hidden border">
              <img
                src={profile().avatar_src}
                class="min-w-full min-h-full bg-neutral-930"
              />
            </div>

            <div class="space-y-2">
              <div class="space-y-0.5">
                <div class="font-bold text-2xl">{profile().name}</div>
                <div class="c-description">{profile().role}</div>
              </div>

              <div class="flex items-center space-x-2">
                <EditProfileButton />

                <Show fallback={<SignInButton />} when={signed_in()}>
                  <Button
                    class="btn btn-sm"
                    onClick={() => {
                      setSignedOut(true);
                      setTimeout(() => {
                        // Start with a new guest account
                        ls_host.removeItem("profile_jwt_token");
                        db.auth.signOut();
                        window.location.reload();
                      }, 200);
                    }}
                  >
                    Sign Out
                  </Button>
                </Show>
              </div>
            </div>
          </div>

          <Show when={user_contacts().length > 0}>
            <div class="p-6 border rounded-lg space-y-2">
              <div class="font-semibold">Contact information</div>

              <For each={user_contacts()}>{(c) => <ContactRow c={c} />}</For>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
