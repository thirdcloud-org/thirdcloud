import { createSignal } from "solid-js";
import { Workspace } from "./database";

export const [workspaces, setWorkspaces] = createSignal<Workspace[]>([]);
export const [selectedWorkspaceId, setSelectedWorkspaceId] =
  createSignal<string>();
export const selectedWorkspace = () =>
  workspaces().find((o) => o.id === selectedWorkspaceId());
