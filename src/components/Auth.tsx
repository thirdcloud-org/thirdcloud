import { tx } from "@instantdb/core";
import { createEffect, JSX, onCleanup, onMount, Show } from "solid-js";
import {
  auth,
  launchApp,
  profile,
  setAuth,
  setLaunchApp,
  setProfile,
  signedOut,
} from "~/global";
import { ls_host } from "~/local";
import { profile_create, profile_read } from "~/server";
import { db, Profile } from "./database";
import LandingPage from "./LandingPage";
import SplashScreen from "./SplashScreen";
import { loadGuestProfile } from "./guest_profile";

export function Auth(props: { children?: JSX.Element }) {
  onMount(() => {
    db.subscribeAuth(async (auth) => {
      setAuth(auth);
    });
  });

  createEffect(() => {
    const _auth = auth();
    if (!_auth) return;

    const id = auth()?.user?.id;
    if (!id) {
      loadGuestProfile();
      return;
    }

    setLaunchApp(true);
    const unsubcribe = db.subscribeQuery(
      {
        profiles: {
          $: {
            where: {
              "$users.id": id,
            },
          },
        },
      },
      async (result) => {
        if (signedOut()) return;
        const p = result.data?.profiles[0];
        if (p) {
          console.log("setting profile", p);
          setProfile(p);
          await ls_host.removeItem("profile_jwt_token");
          return;
        }

        // Flow: guest profile created, user loggin
        // 1. If there is a cloud profile, load it to replace guest profile
        // 2. If there is no cloud profile, link guest profile to user
        // Case 2 has some edge cases:
        // 1. User signs in before cloud profile is created -> hence await loadGuestProfile
        // 2. If cloud profile is deleted for some reason, the user will now link to a guest profile
        await loadGuestProfile();

        console.log(`linking profile ${profile().id} with user ${id}`);
        db.transact(
          tx.profiles[profile().id].link({
            $users: id,
          })
        );
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  return (
    // Either
    // 1. Do not have user, created a cloud guest profile
    // 2. Have a user, found their profile
    <Show fallback={<SplashScreen />} when={auth() && profile()}>
      <Show fallback={<LandingPage />} when={launchApp()}>
        {props.children}
      </Show>
    </Show>
  );
}
