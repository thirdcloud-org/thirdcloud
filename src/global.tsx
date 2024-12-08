import { AuthResult } from "@instantdb/core/dist/module/clientTypes";
import { createSignal, observable } from "solid-js";
import useOverlay from "./components/UseOverlay";
import { CompileResult } from "./lib/compiler";
import { ls_host } from "./local";

export const bodyOverlay = useOverlay();
export const sw: () => Omit<ServiceWorker, "postMessage"> & {
  postMessage: (message: AppMessage) => void;
} = () => navigator.serviceWorker.controller!;

export const [launchApp, setLaunchApp] = createSignal<boolean>(false);
export const [signedOut, setSignedOut] = createSignal<boolean>(false);
export const [auth, setAuth] = createSignal<AuthResult>();
export const user = () => auth()?.user;
export const [_profile, setProfile] = createSignal<Profile>();
export const [_profileJwtToken, setProfileJwtToken] = createSignal<string>();
export const profileJwtToken = () => _profileJwtToken()!;
export const profile = () => _profile()!;
export const signed_in = () => !!auth()?.user?.id;
export const user_contacts = () => {
  const u = user();
  const result = [...profile().contacts];
  if (u) result.push({ type: "email", value: u.email });
  return result;
};

export type AppMessage = any;

declare global {
  interface Window {
    sesLockedDown: boolean;
  }

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

  // Database

  export interface Channel {
    id: string;
    name: string;
    type: "text" | "voice";
  }

  export interface Message {
    id: string;
    content: string;
    created_at: string;
  }

  export interface Note {
    id: string;
    name: string;
    emoji_unified: string;
  }

  export interface NoteDetail {
    id: string;
    state: string;
  }

  export type Contact = {
    type: "mobile" | "email";
    value: string;
  };
  export interface Profile {
    device_id: string;
    id: string;
    name: string;
    role: string;
    description: string;
    contacts: Contact[];
    avatar_src: string;
    banner_src: string;
  }

  export type Workspace = {
    id: string;
    name: string;
  };

  type RoomSchema = any;
  // // Provide a room schema to get typings for presence!
  // type RoomSchema = {
  //     note: {
  //         presence: { name: string };
  //         topics: {
  //             onAwarenessUpdate: {
  //                 update: number[];
  //             };
  //             onDocUpdate: {
  //                 update: number[];
  //             };
  //         };
  //     };
  //     voice: {
  //         presence: DeviceMetadata;
  //     };
  // };

  type Schema = {
    // channels: Channel;
    // messages: Message;
    // notes: Note;
    // noteDetails: NoteDetail;
    profiles: Profile;
  };
}
