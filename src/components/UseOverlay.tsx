import { createSignal } from "solid-js";

export default function useOverlay() {
  const [overlayHidden, setOverlayHidden] = createSignal(true);
  const [notHideLock, setNotHideLock] = createSignal(false);

  let t: ReturnType<typeof setTimeout>;
  const hideSoon = () => {
    clearTimeout(t);
    setOverlayHidden(false);
    t = setTimeout(() => {
      if (notHideLock()) return;
      setOverlayHidden(true);
    }, 3000);
  };

  return {
    overlayHidden,
    setOverlayHidden,
    notHideLock,
    setNotHideLock,
    hideSoon,
  };
}
