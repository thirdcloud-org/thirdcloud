import { createSignal } from "solid-js";
import useOverlay from "./components/UseOverlay";
import { AuthResult } from "@instantdb/core/dist/module/clientTypes";
import { Profile } from "./components/database";
import { IconTypes } from "solid-icons";
import { CompileResult } from "./lib/compiler";

export const bodyOverlay = useOverlay();
export const sw: () => Omit<ServiceWorker, "postMessage"> & {
  postMessage: (message: AppMessage) => void;
} = () => navigator.serviceWorker.controller!;

export const [auth, setAuth] = createSignal<AuthResult>();
// Make sure only used after user is logged in
export const user = () => auth()?.user;
export const [profile, setProfile] = createSignal<Profile>();

export type AppMessage = any;
// {
//     type: 'INSTALL_APP',
//     app_id: string,
//     index: string,
//     offline: boolean
// }

declare global {
  type ResolvePath = (relativePath: string) => string;

  type AppMeta = {
    id: string;
    name: string;
    description: string;
    readme: string;
    categories: string[];
    author_name: string;
    icon: string;
    index: string;
  };

  type Resource =
    | {
        as: "css";
        value: string;
      }
    | {
        as: "js";
        script:
          | {
              type: "text";
              value: string;
            }
          | {
              type: "src";
              value: string;
            };
        type: "text/javascript" | "module";
      };
  type Installation = {
    id: string;
    // TODO: Allow app icon to be images instead of functions (not serializable)
    meta: Omit<AppMeta, "icon">;
    disabled: boolean;
    allow_page_reload: boolean;
    compiledResult: CompileResult;
  };
}
