import { TbLoader } from "solid-icons/tb";
import { Accessor, Component, createSignal, JSX } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";

type TriggerError = boolean;
export default function Button(props: {
  onClick: (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: DOMElement;
    }
  ) => Promise<TriggerError | void> | void;
  icons?: {
    idle?: Component;
    success?: Component;
    failure?: Component;
  };
  children: JSX.Element;
  class?: string;
  disabled?: boolean;
  // doing?: Accessor<boolean>;
}) {
  const [state, setState] = createSignal<
    "idle" | "doing" | "success" | "failure"
  >("idle");
  const IconComp = () => {
    const s = state();
    return s == "doing"
      ? () => <TbLoader class="w-4 h-4 animate-spin" />
      : props.icons
      ? props.icons[s] ?? props.icons.idle
      : undefined;
  };

  return (
    <button
      disabled={state() == "doing" || props.disabled}
      class={"btn flex items-center space-x-1.5 " + props.class}
      onClick={async (e) => {
        setState("doing");
        const error = await props.onClick(e);
        setState(error ? "failure" : "success");
      }}
    >
      <Dynamic component={IconComp()} />
      <div>{props.children}</div>
    </button>
  );
}
