import { createSignal } from "solid-js";

export const [flow, setFlow] = createSignal<
  "no_profile" | "email" | "code" | "profile"
>("no_profile");
export const [email, setEmail] = createSignal("");
export const [code, setCode] = createSignal("");
