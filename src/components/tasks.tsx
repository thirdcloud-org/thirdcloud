import { Accessor, batch, createSignal, Setter } from "solid-js";

export type RunningTaskData = {
  type: "install" | "remove" | "disable" | "enable";
  app_id: string;
  description: string;
};
export type RunningTask = {
  id: string;
  description: string;
  date: Date;
  completed?: boolean;
} & RunningTaskData;

export const [tasks, setTasks] = createSignal<RunningTask[]>([]);

export const sortedTasks = () =>
  tasks().sort((a, b) => b.date.getTime() - a.date.getTime());
export function addTask(data: RunningTaskData) {
  const id = crypto.randomUUID();
  let task: RunningTask = {
    id,
    date: new Date(),
    ...data,
  };

  batch(() => {
    setTasks([...tasks(), task as RunningTask]);
  });
  return id;
}

export function markComplete(id: string) {
  setTasks(
    tasks().map((task) => {
      if (task.id == id) {
        return {
          ...task,
          completed: true,
        };
      }
      return task;
    })
  );
}
