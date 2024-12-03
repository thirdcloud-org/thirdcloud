import { serialize } from "seroval";
import { createSignal } from "solid-js";
import { addTask, markComplete, RunningTaskData } from "~/components/tasks";
import { compile, CompileResult } from "~/lib/compiler";
import { Sandbox } from "~/lib/sandbox/sanbox";
import { cachedInstallations } from "~/local";
import { showToast } from "~/toast";
import Button from "./Button";

export const [installations, setInstallations] = createSignal<Installation[]>(
  []
);

export const appMetas: AppMeta[] = [
  {
    id: "0000-0000-0000-0001",
    name: "Chat Hub",
    description:
      "Centralize team communication with threads, channels, and real-time messaging.",
    readme: `
# Chat Hub

The Chat Hub centralizes team messaging, providing an efficient, real-time communication platform to enhance collaboration. Ideal for remote teams, it allows structured conversations in channels and threads, ensuring organized and efficient exchanges.

### Key Concepts
- **Channels**: Organize discussions by team, project, or topic.
- **Threads**: Allow users to reply directly to specific messages, keeping conversations focused.
- **Real-Time Communication**: Instant messaging for quick exchanges.

### Features
- Public and private channels for secure and focused discussions.
- Threaded replies for organized and clear conversations.
- Emoji reactions, @mentions, and notifications.
- File sharing and preview options for faster collaboration.
    `,
    categories: ["Communication", "Collaboration"],
    author_name: "ThirdCloud",
    icon: "/suite/chat.png",
    // index:
    //   "https://github.com/tri2820/thirdcloud/blob/main/examples/three-cube/dist/index.html",
    index: "http://localhost:5173/index.html",
  },
  {
    id: "0000-0000-0000-0002",
    name: "Project Management Board",
    description:
      "Plan, organize, and track projects with Kanban boards and Gantt charts.",
    readme: `
# Project Management Board

A comprehensive project management tool, the Project Management Board organizes tasks, assigns deadlines, and tracks project progress. Using both Kanban boards and Gantt charts, this app provides teams with flexibility to manage tasks efficiently and meet project goals.

### Key Concepts
- **Kanban Board**: Visualize workflows and track task status.
- **Gantt Chart**: Plan timelines and dependencies for detailed project tracking.
- **Collaboration**: Assign tasks, add comments, and share updates.

### Features
- Task creation, assignment, and due dates.
- Kanban columns to track task status (To-Do, In Progress, Done).
- Gantt chart view for detailed project timelines.
- Notifications and comments for real-time updates.
    `,
    categories: ["Productivity", "Project Management"],
    author_name: "ThirdCloud",
    icon: "/suite/project.png",
    index:
      "https://github.com/tri2820/thirdcloud/blob/main/examples/project-management-board/dist/index.html",
  },
  {
    id: "0000-0000-0000-0003",
    name: "Collaborative Notes",
    description: "Real-time note-taking with templates and rich text editing.",
    readme: `
# Collaborative Notes

Collaborative Notes allows team members to create, edit, and share notes in real-time. Designed for brainstorming, meeting notes, and documentation, it includes rich text formatting and customizable templates for structured note-taking.

### Key Concepts
- **Real-Time Collaboration**: Simultaneous editing for seamless teamwork.
- **Rich Text Editing**: Format notes with bold, italics, lists, and more.
- **Templates**: Quickly set up notes for recurring tasks or meetings.

### Features
- Real-time editing with version control and undo capabilities.
- Pre-made templates for meetings, to-do lists, and documentation.
- Inline comments for focused discussions.
- Export options for PDF, Word, or Markdown.
    `,
    categories: ["Productivity", "Note-taking"],
    author_name: "ThirdCloud",
    icon: "/suite/notes.png",
    index:
      "https://github.com/tri2820/thirdcloud/blob/main/examples/collaborative-notes/dist/index.html",
  },
  {
    id: "0000-0000-0000-0005",
    name: "Whiteboard",
    description:
      "Collaborative whiteboard for brainstorming and visual note-taking.",
    readme: `
# Whiteboard

The Whiteboard app offers a digital space for brainstorming and visual collaboration. Users can draw, add sticky notes, and collaborate on ideas, perfect for creative brainstorming and design discussions.

### Key Concepts
- **Visual Collaboration**: Draw, write, and share ideas in real-time.
- **Sticky Notes and Shapes**: Structure ideas with easy-to-use tools.
- **Freehand Drawing**: Sketch ideas with intuitive pen tools.

### Features
- Drag-and-drop sticky notes, shapes, and images.
- Freehand drawing tools with various brush options.
- Multi-user collaboration with real-time updates.
- Export to PDF or image formats for easy sharing.
    `,
    categories: ["Productivity", "Collaboration"],
    author_name: "ThirdCloud",
    icon: "/suite/whiteboard.png",
    index:
      "https://github.com/tri2820/thirdcloud/blob/main/examples/whiteboard/dist/index.html",
  },
];

export const [selectedAppId, setSelectedAppId] = createSignal<
  string | undefined
>(undefined);

export function taskify<T>(f: (props: T) => Promise<void>) {
  return (mkTask: (props: T) => RunningTaskData) => {
    return async (props: T) => {
      const task = mkTask(props);
      const id = addTask(task);
      await f(props);
      markComplete(id);
    };
  };
}

export const sandboxes = new Map<string, Sandbox>();
export const shadowRoots = new Map<string, ShadowRoot>();

export const onUIReady = async (id: string, shadowRoot: ShadowRoot) => {
  const ins = installationOf(id);
  if (!ins) throw new Error("No installation found for " + id);

  shadowRoots.set(id, shadowRoot);
  const sandbox = new Sandbox(ins.id, {
    allow_page_reload: ins.allow_page_reload,
  });

  sandboxes.set(id, sandbox);

  sandbox.setShadowRoot(shadowRoot);

  const headDiv = document.createElement("div");
  headDiv.id = "head";

  const bodyDiv = document.createElement("div");
  bodyDiv.id = "body";
  bodyDiv.innerHTML = ins.compiledResult.body;

  const template = document.createElement("template");
  template.content.appendChild(headDiv);
  template.content.appendChild(bodyDiv);

  shadowRoot.appendChild(template.content);

  console.log("compiledResult", ins.compiledResult);
  for (const stylesheet of ins.compiledResult.stylesheets) {
    if (stylesheet.href) {
      console.log("import", stylesheet);
      sandbox.import(stylesheet.href);
    } else {
      const style = document.createElement("style");
      style.innerHTML = stylesheet.content;
      shadowRoot.appendChild(style);
    }
  }

  for (const script of ins.compiledResult.scripts) {
    if (script.type == "module") {
      if (script.src) {
        console.log("random import src", script);
        sandbox.import(script.src);
      } else {
        const randomIdentifier = crypto.randomUUID();
        await sandbox.createModuleSource(
          randomIdentifier,
          script.content,
          true
        );
        console.log("random import", randomIdentifier, script);
        sandbox.import(randomIdentifier);
      }
    } else {
      if (script.src) {
        const src = script.src;
        (async () => {
          const code = await sandbox.fetch(src);
          console.log("evaluate", src);
          sandbox.evaluate(code);
        })();
      } else {
        console.log("evaluate", script.content);
        sandbox.evaluate(script.content);
      }
    }
  }
};

export const getResolvePathFunction = (index: string) => {
  let resolvePath: ResolvePath;
  const url = new URL(index);

  const segments = url.pathname.split("/");
  const indexFile = segments.pop();

  if (!indexFile) {
    throw new Error("No index file found");
  }

  const folderUrl = `${url.origin}${segments.join("/")}/`;
  console.log("folderUrl", folderUrl);
  console.log("indexFile", indexFile);

  // If the host is github.com
  // Modify the URL to include the raw parameter
  if (url.hostname === "github.com") {
    // WARNING: Only works for root-relative paths
    resolvePath = (relativePath: string) => {
      if (relativePath.startsWith("/")) relativePath = relativePath.slice(1);
      console.log("called with", relativePath);
      const url = new URL(relativePath, folderUrl);
      url.searchParams.set("raw", "true");
      const absolutePath = url.toString();
      console.log("return", absolutePath, folderUrl);
      return absolutePath;
    };
  }
  // ... other hosts
  // Fallback
  else {
    resolvePath = (relativePath: string) => {
      if (relativePath.startsWith("/")) relativePath = relativePath.slice(1);
      const url = new URL(relativePath, folderUrl);
      return url.toString();
    };
  }

  const indexPath = resolvePath(indexFile);

  return {
    resolvePath,
    indexPath,
  };
};

const fetchIndex = async (indexPath: string) => {
  const proxyPath = indexPath;
  const response = await fetch(proxyPath);
  if (!response.ok) throw new Error("Cannot fetch index");

  let compiledResult: CompileResult;
  const html = await response.text();
  console.log("html", html);
  compiledResult = compile(html);
  console.log("Compiled result:", {
    compiledResult,
    html,
    proxyPath,
  });

  return compiledResult;
};

export const toast_err_cannot_install = () => {
  showToast({
    title: "We couldn't install this app",
    description:
      "Mind trying again? If the problem continues, our team is here to help.",
    type: "error",
  });
};

export const install = async (app: AppMeta) => {
  try {
    const { resolvePath, indexPath } = getResolvePathFunction(app.index);
    const compiledResult = await fetchIndex(indexPath);

    const meta = { ...app, icon: undefined };
    // Only contains serializable values
    const ins: Installation = {
      id: app.id,
      meta,
      disabled: false,
      allow_page_reload: true,
      compiledResult,
    };

    setInstallations([ins, ...installations()]);
    console.log("ins", ins);
    const serialized = serialize(ins);
    await cachedInstallations.setItem(app.id, serialized);
  } catch (e) {
    console.error("Cannot install app", e);
    toast_err_cannot_install();
  }
};

export const remove = async (app: AppMeta) => {
  setInstallations([
    ...installations().filter((installation) => installation.id != app.id),
  ]);

  await cachedInstallations.removeItem(app.id);
};

const set = (disabled: boolean) => async (app: AppMeta) => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const installation = installationOf(app.id);
  if (!installation) return;
  const newIns: Installation = {
    ...installation,
    disabled,
  };
  setInstallations([
    ...installations().filter((installation) => installation.id != app.id),
    newIns,
  ]);

  await cachedInstallations.setItem(app.id, serialize(newIns));
};

export const disable = set(true);
export const enable = set(false);
export const enabledInstallations = () =>
  installations().filter((i) => !i.disabled);

export const installationOf = (app_id: string) =>
  installations().find((installation) => installation.id == app_id);

export function mkButton(type: "install" | "remove" | "enable" | "disable") {
  const { f, label, doingLabel } = {
    install: {
      f: install,
      label: "Install",
      doingLabel: "Installing...",
    },
    remove: {
      f: remove,
      label: "Remove",
      doingLabel: "Removing...",
    },
    enable: {
      f: enable,
      label: "Enable",
      doingLabel: "Enabling...",
    },
    disable: {
      f: disable,
      label: "Disable",
      doingLabel: "Disabling...",
    },
  }[type];

  const taskAction = taskify(f)((app) => ({
    type,
    app_id: app.id,
    description: `${label} ${app.name}`,
  }));

  return (app: AppMeta) => {
    const [doing, setDoing] = createSignal(false);

    return (
      <Button
        onClick={async (e) => {
          e.stopPropagation();
          setDoing(true);
          await taskAction(app);
          setDoing(false);
        }}
        class="btn btn-sm"
        disabled={doing()}
      >
        {doing() ? doingLabel : label}
      </Button>
    );
  };
}
