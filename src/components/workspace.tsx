import { createSignal } from "solid-js";

export const [workspaces, setWorkspaces] = createSignal<Workspace[]>([]);
export const [_selectedWorkspaceId, setSelectedWorkspaceId] =
  createSignal<string>();
export const selectedWorkspaceId = () => _selectedWorkspaceId()!;

export const selectedWorkspace = () =>
  workspaces().find((o) => o.id === selectedWorkspaceId());
