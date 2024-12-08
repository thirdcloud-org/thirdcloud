import { id, init, tx } from "@instantdb/admin";
import * as jose from "jose";
import { getRequestEvent } from "solid-js/web";
// import { Profile } from "./components/database";

const str_to_uint8arr = (str: string) => new TextEncoder().encode(str);

function getSecretKey(name: string) {
  const event = getRequestEvent();
  const secret_key =
    event?.nativeEvent.context.cloudflare?.env[name] ?? process.env[name];
  return secret_key;
}

function instantdb() {
  const INSTANT_APP_ADMIN_TOKEN = getSecretKey("INSTANT_APP_ADMIN_TOKEN");
  return init({
    appId: import.meta.env.VITE_INSTANTDB_APP_ID,
    adminToken: INSTANT_APP_ADMIN_TOKEN,
  });
}

// Since we allow guest profiles, CRUD on profiles needs to be server-side
export async function profile_read(jwt_token: string) {
  "use server";
  const JWT_SECRET_KEY = getSecretKey("JWT_SECRET_KEY");
  const { payload } = await jose.jwtVerify(
    jwt_token,
    str_to_uint8arr(JWT_SECRET_KEY)
  );
  const { table, id: profile_id } = payload as {
    table: string;
    id: string;
  };
  console.log("payload", payload);

  if (table !== "profiles" || !profile_id) throw new Error("Invalid token");

  const db = instantdb();
  const data = await db.query({
    profiles: {
      $: {
        where: {
          id: profile_id,
        },
      },
    },
  });

  const profile = data.profiles.at(0);
  if (!profile) throw new Error("Profile not found");

  return profile;
}

export async function profile_create(data: any) {
  "use server";
  const JWT_SECRET_KEY = getSecretKey("JWT_SECRET_KEY");
  const db = instantdb();
  const profile_id = id();
  const result = await db.transact([tx.profiles[profile_id].update(data)]);
  console.log("created profile result", result);
  const token = await new jose.SignJWT({ table: "profiles", id: profile_id })
    .setProtectedHeader({ alg: "HS256" })
    .sign(str_to_uint8arr(JWT_SECRET_KEY));
  return token;
}

export async function profile_update(secret: string, id: string, data: any) {
  const db = instantdb();
  const result = await db.transact(tx.profiles[id].update(data));
  console.log("profile updated", result);
  return result;
}

export async function profile_delete(secret: string, id: string) {
  throw new Error("Not implemented");
}
