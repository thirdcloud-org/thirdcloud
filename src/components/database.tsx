import {
    init,
    InstantClient
} from "@instantdb/core";


export interface Channel {
    id: string;
    name: string;
    type: "text" | "voice";
}

export interface Message {
    id: string;
    content: string;
    created_at: string;
}

export interface Note {
    id: string;
    name: string;
    emoji_unified: string;
}

export interface NoteDetail {
    id: string;
    state: string;
}

type Contact = {
    type: 'mobile',
    value: string
}
export interface Profile {
    id: string;
    name: string;
    role: string;
    description: string;
    contacts: Contact[];
    avatar_url: string;
}

type RoomSchema = any;
// // Provide a room schema to get typings for presence!
// type RoomSchema = {
//     note: {
//         presence: { name: string };
//         topics: {
//             onAwarenessUpdate: {
//                 update: number[];
//             };
//             onDocUpdate: {
//                 update: number[];
//             };
//         };
//     };
//     voice: {
//         presence: DeviceMetadata;
//     };
// };

type Schema = {
    // channels: Channel;
    // messages: Message;
    // notes: Note;
    // noteDetails: NoteDetail;
    profiles: Profile;
};



export let db: InstantClient<Schema, RoomSchema>;

if (typeof window !== "undefined") {
    db = init<Schema, RoomSchema>({
        appId: import.meta.env.VITE_INSTANTDB_APP_ID,
        devtool: false,
    });
    window.addEventListener("beforeunload", () => {
        db.shutdown();
    });
}


// export function useQuery<T extends Query>(
//     query: Accessor<Exactly<Query, T> | null | undefined>,
//     opts: {
//         noLive?: boolean;
//     } = {}
// ) {
//     const [isLoading, setIsLoading] = createSignal(true);
//     const [response, setResponse] = createSignal<SubscriptionState<T, Schema>>();
//     const data = () => response()?.data;
//     const error = () => response()?.error;
//     const pageInfo = () => response()?.pageInfo;

//     let unsubscribe: () => void | undefined;

//     createEffect(() => {
//         const q = query();

//         if (!q) {
//             console.log("return empty q");
//             return;
//         }

//         // console.log("query changed", JSON.stringify(q));
//         unsubscribe = db.subscribeQuery<T>(q, (resp) => {
//             // console.log("called for ", JSON.stringify(q), JSON.stringify(resp));
//             batch(() => {
//                 // console.log("set", JSON.stringify(q));
//                 setResponse(resp);
//                 setIsLoading(false);
//             });
//             if (opts.noLive) setTimeout(unsubscribe, 200);
//         });

//         if (typeof window !== "undefined") {
//             window.addEventListener("beforeunload", () => {
//                 unsubscribe();
//             });
//         }

//         onCleanup(() => {
//             // console.log("unsubscribe for", JSON.stringify(q));
//             unsubscribe();
//             setIsLoading(true);
//         });
//     });

//     return {
//         isLoading,
//         data,
//         error,
//         pageInfo,
//     };
// }