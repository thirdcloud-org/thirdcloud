import { deserialize } from "seroval";
import {
  batch,
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  onMount,
} from "solid-js";
import { installations, setInstallations } from "~/components/apps";
import { profile } from "~/global";
import { ls_host_installations } from "~/local";
import { showToast } from "~/toast";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";
import { db } from "./database";
import {
  _selectedWorkspaceId,
  selectedWorkspaceId,
  setSelectedWorkspaceId,
  setWorkspaces,
} from "./workspace";

export default function MainApp(props: { children?: JSX.Element }) {
  const [loaded, setLoaded] = createSignal(false);
  const [open, setOpen] = createSignal(false);

  let runOnce = false;
  createEffect(async () => {
    const _loaded = loaded();
    if (_loaded) return;
    if (runOnce) return;
    runOnce = true;

    const keys = await ls_host_installations.keys();
    const serializeds = await Promise.all(
      keys.map((k) => ls_host_installations.getItem(k))
    );
    const _installations = serializeds.map((s) => deserialize(s as string));
    setInstallations(_installations as any[]);
    console.log("_installations", _installations, installations());
  });

  createEffect(() => {
    const _loaded = loaded();
    const _selectedWorkspaceId = selectedWorkspaceId();

    if (!_loaded) return;

    const url = new URL(window.location.href);

    if (_selectedWorkspaceId) {
      url.searchParams.set("workspace", _selectedWorkspaceId);
    } else {
      url.searchParams.delete("workspace");
    }

    window.history.replaceState({}, "", url.toString());
  });

  onMount(() => {
    const url = new URL(window.location.href);
    const workspace_id = url.searchParams.get("workspace");
    if (workspace_id) setSelectedWorkspaceId(workspace_id);

    const unsubcribe = db.subscribeQuery(
      {
        workspaces: {
          $: {
            where: {
              "profiles.id": profile().id,
            },
          },
        },
      },
      async (state) => {
        const _loaded = loaded();
        const _workspaces = state.data?.workspaces;
        if (!_workspaces) {
          console.warn("No workspaces found");
          return;
        }

        console.log("workspaces", _workspaces);
        setWorkspaces(_workspaces as Workspace[]);

        const selected = _workspaces.find(
          (o) => o.id === _selectedWorkspaceId()
        );

        if (_loaded) {
          if (!selected) {
            // TODO: if workspace sudddenly deleted when user is working
          }
          return;
        }

        // First load
        if (selected) {
          setSelectedWorkspaceId(selected.id);
          setLoaded(true);
          return;
        }

        if (open()) return;

        console.log(
          "_selectedWorkspaceId()",
          _selectedWorkspaceId(),
          _workspaces
        );
        if (_selectedWorkspaceId()) {
          showToast({
            title: "Workspace not found",
            description: "You have been redirected to the default workspace",
            type: "error",
          });
        }

        // Default
        const firstWorkspace = _workspaces.at(0);
        if (firstWorkspace) {
          setSelectedWorkspaceId(firstWorkspace.id);
          setLoaded(true);
        } else {
          setOpen(true);
        }
      }
    );

    onCleanup(() => {
      unsubcribe();
    });
  });

  const safeSetOpen: any = (v: boolean) => {
    if (!loaded()) {
      console.warn("Keep dialog open");
      return;
    }

    setOpen(v);
  };
  return (
    <>
      <CreateWorkspaceDialog
        open={open}
        setOpen={safeSetOpen}
        compulsory
        onCreated={async (workspace) => {
          batch(() => {
            setSelectedWorkspaceId(workspace.id);
            setOpen(false);
          });
          showToast({
            title: `Workspace "${workspace.name}" created`,
            description: "You can now switch to it",
            type: "success",
          });
        }}
      />
      <div class="animate-fade">{props.children}</div>
    </>
  );
}
