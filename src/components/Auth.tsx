import { createEffect, JSX, onCleanup, onMount, Show } from "solid-js";
import {
  _setProfile,
  auth,
  launchApp,
  profile,
  setAuth,
  setGuestProfile,
  setLaunchApp,
  user_id,
} from "~/global";
import { db, Profile } from "./database";
import LandingPage from "./LandingPage";
import SplashScreen from "./SplashScreen";
import { ls_host } from "~/local";

export function Auth(props: { children?: JSX.Element }) {
  onMount(() => {
    console.log("setup");
    db.subscribeAuth(async (auth) => {
      console.log("got auth", auth);
      setAuth(auth);
    });
  });

  onMount(async () => {
    const names = [
      "Sir Eatsalot",
      "Twigslayer",
      "Goldpocket",
      "Sizzlebeard",
      "Iron Knees",
      "Thunderbolt",
      "Sneaky Socks",
      "Cuddlebug",
    ];

    const local_guest_profile = (await ls_host.getItem(
      "guest_profile"
    )) as Profile;
    if (local_guest_profile) {
      setGuestProfile(local_guest_profile);
    } else {
      const random_default_profile: Profile = {
        id: crypto.randomUUID(),
        avatar_url: `${window.location.origin}/default-avatar.svg`,
        contacts: [],
        description: "Hello everyone.",
        name: names[Math.floor(Math.random() * names.length)],
        role: "ThirdCloud User",
      };

      ls_host.setItem("guest_profile", random_default_profile);

      setGuestProfile(random_default_profile);
    }
  });

  createEffect(() => {
    const id = user_id();
    if (!id) {
      _setProfile();
      return;
    }

    setLaunchApp(true);
    const unsubcribe = db.subscribeQuery(
      {
        profiles: {
          $: {
            where: {
              id,
            },
          },
        },
      },
      (result) => {
        _setProfile(result.data?.profiles[0]);
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  return (
    // When we have auth (know if user is logged in or not to show landing page) and profile (local guest profile is loaded)
    <Show fallback={<SplashScreen />} when={auth() && profile()}>
      <Show fallback={<LandingPage />} when={launchApp()}>
        {props.children}
      </Show>
    </Show>
  );
}
