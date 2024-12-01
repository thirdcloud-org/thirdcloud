import { createEffect } from "solid-js";
import { Dynamic } from "solid-js/web";
import { profile } from "~/global";
import { flow, setCode, setEmail, setFlow } from "./auth/authflow";
import NoProfile from "./auth/NoProfile";
import ProfileSettings from "./auth/ProfileSettings";
import RequireCode from "./auth/RequireCode";
import RequireEmail from "./auth/RequireEmail";

export default function TabProfileBody() {
  createEffect(() => {
    const _flow = flow();
    if (_flow === "profile") {
      setEmail("");
      setCode("");
    }
  });

  createEffect(() => {
    const _profile = profile();
    if (_profile) {
      setFlow("profile");
    } else {
      setFlow("no_profile");
    }
  });

  const components = {
    no_profile: NoProfile,
    email: RequireEmail,
    code: RequireCode,
    profile: ProfileSettings,
  };

  return <Dynamic component={components[flow()]} />;
}
