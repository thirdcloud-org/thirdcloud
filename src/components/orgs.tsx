import { createSignal } from "solid-js";

type Org = any;

export const [orgs, setOrgs] = createSignal<Org[]>([]);
export const [selectedOrgId, setSelectedOrgId] = createSignal<string>();
export const selectedOrg = () => orgs().find((o) => o.id === selectedOrgId());
