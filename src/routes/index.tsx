import { For, JSX } from "solid-js";
import AppLayout from "~/components/AppLayout";

import { installations } from "~/components/apps";
import Layout from "~/components/Layout";
import { activeTabId } from "~/components/tabs";
import TabAddBody from "~/components/tabs/add/TabAddBody";
import TabAddSidebar from "~/components/tabs/add/TabAddSidebar";
import TabGenericBody from "~/components/tabs/generic/TabGenericBody";
import TabGenericSidebar from "~/components/tabs/generic/TabGenericSidebar";
import TabProfileBody from "~/components/tabs/profile/TabProfileBody";

function TabContent(props: { children?: JSX.Element; id: string }) {
  return (
    <div
      data-show={props.id == activeTabId()}
      class="h-full data-[show=true]:block hidden"
    >
      {props.children}
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <TabContent id="profile">
        <AppLayout>
          <TabProfileBody />
        </AppLayout>
      </TabContent>

      <TabContent id="add">
        <AppLayout showSidebar sidebar={<TabAddSidebar />}>
          <TabAddBody />
        </AppLayout>
      </TabContent>

      <For each={installations()}>
        {(ins) => (
          <TabContent id={ins.id}>
            <AppLayout sidebar={<TabGenericSidebar />}>
              <TabGenericBody app_id={ins.id} />
            </AppLayout>
          </TabContent>
        )}
      </For>
    </Layout>
  );
}
