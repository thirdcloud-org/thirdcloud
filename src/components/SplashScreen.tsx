import { VsLoading } from "solid-icons/vs";

export default function () {
  return (
    <div class="h-screen flex items-center justify-center">
      <div class="flex items-center space-x-2">
        <img src="/icon.svg" class="w-10 h-10" />
        <VsLoading class="w-6 h-6 animate-spin" />
      </div>
    </div>
  );
}
