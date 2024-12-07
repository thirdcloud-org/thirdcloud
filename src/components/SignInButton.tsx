import { Dialog } from "@kobalte/core/dialog";
import { BsBoxArrowInRight, BsEnvelopeFill } from "solid-icons/bs";
import { Dynamic } from "solid-js/web";
import Button from "~/components/Button";
import { flow, open, setOpen } from "./tabs/profile/auth/authflow";
import RequireCode from "./tabs/profile/auth/RequireCode";
import RequireEmail from "./tabs/profile/auth/RequireEmail";
export default function SignInButton() {
  const components = {
    email: RequireEmail,
    code: RequireCode,
  };

  return (
    <>
      <Dialog open={open()} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay class="dialog__overlay" />
          <div class="dialog__positioner">
            <Dialog.Content class="dialog__content">
              <Dynamic component={components[flow()]} />
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog>
      <Button
        class="btn btn-sm flex items-center space-x-1.5"
        onClick={() => {
          setOpen(true);
        }}
        icons={{
          idle: BsBoxArrowInRight,
        }}
      >
        Sign In
      </Button>
    </>
  );
}
