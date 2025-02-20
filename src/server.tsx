import { id, init, tx } from "@instantdb/admin";
import * as jose from "jose";
import { getRequestEvent } from "solid-js/web";

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

async function checkPermission(jwt_token: string) {
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
  return profile_id;
}

async function generate_jwt(profile_id: string) {
  const JWT_SECRET_KEY = getSecretKey("JWT_SECRET_KEY");
  const token = await new jose.SignJWT({ table: "profiles", id: profile_id })
    .setProtectedHeader({ alg: "HS256" })
    .sign(str_to_uint8arr(JWT_SECRET_KEY));
  return token;
}

// Since we allow guest profiles, CRUD on profiles needs to be server-side
export async function profile_read(jwt_token: string) {
  "use server";
  const profile_id = await checkPermission(jwt_token);

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

export async function profile_get_jwt(refresh_token: string) {
  "use server";
  const db = instantdb();
  const user = await db.auth.verifyToken(refresh_token);
  if (!user) throw new Error("Uh oh, you are not authenticated");

  const { profiles } = await db.query({
    profiles: {
      $: {
        where: {
          "$users.id": user.id,
        },
      },
    },
  });

  const profile = profiles.at(0);
  if (!profile) throw new Error("Profile not found");

  const token = await generate_jwt(profile.id);

  return token;
}

export async function profile_create(data: any) {
  "use server";

  const profile_id = id();

  const db = instantdb();
  const result = await db.transact([tx.profiles[profile_id].update(data)]);
  console.log("created profile result", result);

  const token = await generate_jwt(profile_id);

  return token;
}

export async function profile_update(jwt_token: string, data: any) {
  "use server";
  const profile_id = await checkPermission(jwt_token);
  const db = instantdb();
  const result = await db.transact(tx.profiles[profile_id].update(data));
  console.log("profile updated", result);
  return result;
}

export async function profile_create_workspace(
  jwt_token: string,
  workspace: Partial<Workspace>
) {
  "use server";
  const profile_id = await checkPermission(jwt_token);
  const db = instantdb();
  const workspace_id = id();
  const result = await db.transact([
    tx.workspaces[workspace_id].update(workspace).link({
      profiles: profile_id,
    }),
  ]);

  console.log("workspace created", result);
  return workspace_id;
}

export async function profile_delete(secret: string, id: string) {
  throw new Error("Not implemented");
}
