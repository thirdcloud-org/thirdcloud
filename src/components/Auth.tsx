import { createEffect, JSX, onCleanup, onMount } from "solid-js";
import { auth, setAuth, setProfile } from "~/global";
import { db } from "./database";

export function Auth(props: { children?: JSX.Element }) {
  onMount(() => {
    // const query = { members: {} };
    // console.log('query', query)
    // db.subscribeQuery(query, (
    //   result
    // ) => {
    //   console.log('result', result)
    // });

    db.subscribeAuth(async (auth) => {
      // console.log('auth', auth)
      setAuth(auth);
    });
  });

  createEffect(() => {
    const user_id = auth()?.user?.id;
    if (!user_id) {
      setProfile();
      return;
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
        console.log("profile", result);
        setProfile(result.data?.profiles[0]);
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  if (auth()) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
}
