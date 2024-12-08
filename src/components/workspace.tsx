import { createSignal } from "solid-js";

export const [workspaces, setWorkspaces] = createSignal<Workspace[]>([]);
export const [selectedWorkspaceId, setSelectedWorkspaceId] =
  createSignal<string>();
export const selectedWorkspace = () =>
  workspaces().find((o) => o.id === selectedWorkspaceId());
