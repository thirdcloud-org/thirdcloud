import { createSignal } from "solid-js";

export const [open, setOpen] = createSignal(false);
export const [flow, setFlow] = createSignal<"email" | "code">("email");
export const [email, setEmail] = createSignal("");
export const [code, setCode] = createSignal("");
