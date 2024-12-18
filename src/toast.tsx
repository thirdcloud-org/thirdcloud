import { Toast, toaster } from "@kobalte/core/toast";
import {
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsXLg,
} from "solid-icons/bs";
import { Dynamic } from "solid-js/web";

export const showToast = (_props: {
  type: "error" | "success";
  title: string;
  description: string;
}) => {
  const icons = {
    error: BsExclamationCircleFill,
    success: BsCheckCircleFill,
  };

  const id = toaster.show((props) => (
    <Toast persistent toastId={props.toastId} class="toast">
      <div class="toast__content">
        <div>
          <div class="flex items-start space-x-2">
            <div class="py-1">
              <Dynamic component={icons[_props.type]} class="w-5 h-5" />
            </div>

            <div>
              <Toast.Title class="toast__title">{_props.title}</Toast.Title>
              <Toast.Description class="toast__description">
                {_props.description}
              </Toast.Description>
            </div>
          </div>
        </div>
        <Toast.CloseButton class="toast__close-button">
          <BsXLg class="w-4 h-4" />
        </Toast.CloseButton>
      </div>
      {/* <Toast.ProgressTrack class="toast__progress-track">
        <Toast.ProgressFill class="toast__progress-fill" />
      </Toast.ProgressTrack> */}
    </Toast>
  ));

  return id;
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.showToast = showToast;
}
