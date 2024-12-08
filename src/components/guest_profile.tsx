// import { setProfile } from "~/global";
// import { ls_host } from "~/local";
// import { profile_create, profile_read } from "~/server";
// import { Profile } from "./database";

// const names = [
//   "Sir Eatsalot",
//   "Twigslayer",
//   "Goldpocket",
//   "Sizzlebeard",
//   "Iron Knees",
//   "Thunderbolt",
//   "Sneaky Socks",
//   "Cuddlebug",
// ];
// export let profile_jwt_token: string | null = null;
// let callOnce = false;
// let resolve_done: (vale: unknown) => void;
// const promise_result = new Promise((resolve) => {
//   resolve_done = resolve;
// });
// export const loadGuestProfile = async () => {
//   if (callOnce) {
//     const result = await promise_result;
//     return result;
//   }
//   callOnce = true;

//   setProfile();
//   profile_jwt_token = await ls_host.getItem("profile_jwt_token");

//   if (profile_jwt_token) {
//   } else {
//     const random_default_profile: Partial<Profile> = {
//       avatar_src: `${window.location.origin}/default-avatar.svg`,
//       banner_src: `${window.location.origin}/default-banner.jpg`,
//       contacts: [],
//       description: "Hello everyone.",
//       name: names[Math.floor(Math.random() * names.length)],
//       role: "ThirdCloud User",
//     };

//     console.log("call profile_create");
//     profile_jwt_token = await profile_create(random_default_profile);

//     console.log("profile_jwt_token", profile_jwt_token);
//     ls_host.setItem("profile_jwt_token", profile_jwt_token);
//   }

//   console.log("call profile_read");
//   const profile = await profile_read(profile_jwt_token);
//   console.log("profile", profile);

//   setProfile(profile as Profile);
//   resolve_done(profile);
// };
