import { createEffect, JSX, onCleanup, onMount, Show } from "solid-js";
import {
  auth,
  launchApp,
  profile,
  setAuth,
  setLaunchApp,
  setProfile,
} from "~/global";
import { db } from "./database";
import LandingPage from "./LandingPage";
import SplashScreen from "./SplashScreen";

export function Auth(props: { children?: JSX.Element }) {
  onMount(() => {
    db.subscribeAuth(async (auth) => {
      setAuth(auth);
    });
  });

  createEffect(() => {
    const user_id = auth()?.user?.id;
    if (!user_id) {
      setProfile();
      return;
    } else {
      setLaunchApp(true);
    }

    const unsubcribe = db.subscribeQuery(
      {
        profiles: {
          $: {
            where: {
              id: user_id,
            },
          },
        },
      },
      (result) => {
        setProfile(result.data?.profiles[0]);
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  return (
    <Show fallback={<SplashScreen />} when={auth()}>
      {(a) => (
        <Show fallback={<LandingPage />} when={launchApp()}>
          {props.children}
        </Show>
      )}
    </Show>
  );
}
