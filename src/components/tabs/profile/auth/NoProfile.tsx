import { BsIncognito } from "solid-icons/bs";
import { setFlow } from "./authflow";
import Button from "~/components/Button";

export default function NoProfile() {
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
        <BsIncognito class="w-24 h-24 text-neutral-500" />
        <div class="font-medium text-lg">
          You are currently logged in as an anonymous user.
        </div>

        <div class="c-description">
          You can still use the app and interact with others, but your data will
          be lost unless you sign up or login.
        </div>

        <div class="flex space-x-2 items-center">
          <Button
            class="btn btn-sm"
            onClick={() => {
              setFlow("email");
            }}
          >
            Sign up
          </Button>
          <Button
            class="btn btn-sm"
            onClick={() => {
              setFlow("email");
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
