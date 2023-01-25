import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import { GetServiceVersionResponse } from "@jonline/ui/src/generated/federation";
import { GrpcWebImpl, Jonline, JonlineClientImpl } from "@jonline/ui/src/generated/jonline"
import { ServerConfiguration } from "@jonline/ui/src/generated/server_configuration"
import { Platform } from 'react-native';
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport';
import store, { AppDispatch, useTypedDispatch } from "../store";
import { useEffect } from "react";
import { selectAccount } from "./accounts";

export type JonlineServer = {
  host: string;
  secure: boolean;
  serviceVersion?: GetServiceVersionResponse;
  serverConfiguration?: ServerConfiguration;
}
function serverUrl(server: JonlineServer): string {
  return `http${server.secure ? "s" : ""}://${server.host}:27707`;
}

export const timeout = async (time: number, label: string) => {
  await new Promise((res) => setTimeout(res, time));
  throw `Timed out getting ${label}.`;
}

const clients = new Map<string, JonlineClientImpl>();
export async function getServerClient(server: JonlineServer): Promise<Jonline> {
  let host = serverUrl(server);
  if (!clients.has(host)) {
    let client = new JonlineClientImpl(
      new GrpcWebImpl(host, {
        transport: Platform.OS == 'web' ? undefined : ReactNativeTransport({})
      })
    );
    server.serviceVersion = await Promise.race([client.getServiceVersion({}), timeout(5000, "service version")]);
    server.serverConfiguration = await Promise.race([client.getServerConfiguration({}), timeout(5000, "server configuration")]);
    clients.set(host, client);
    store.dispatch(upsertServer(server));
    return client;
  }
  return clients.get(host)!;
}

export interface ServersState {
  status: "unloaded" | "loading" | "loaded" | "errored";
  error?: Error;
  successMessage?: string;
  errorMessage?: string;
  // Current server the app is pointing to.
  server?: JonlineServer;
  ids: EntityId[];
  entities: Dictionary<JonlineServer>;
}

const serversAdapter = createEntityAdapter<JonlineServer>({
  selectId: serverUrl,
});

export const upsertServer = createAsyncThunk<JonlineServer, JonlineServer>(
  "servers/create",
  async (server) => {
    // getServerClient will update/upsert the server as a side effect.
    let client = await getServerClient(server);
    // let serviceVersion: GetServiceVersionResponse = await Promise.race([client.getServiceVersion({}), timeout(5000, "service version")]);
    // let serverConfiguration = await Promise.race([client.getServerConfiguration({}), timeout(5000, "server configuration")]);
    return server;
  }
);

const initialServer: JonlineServer | undefined = Platform.OS == 'web' && globalThis.window?.location ? {
  host: window.location.hostname,
  secure: window.location.protocol == 'https:',
} : {
  host: 'jonline.io',
  secure: true,
}

const initialState: ServersState = {
  status: "unloaded",
  error: undefined,
  server: initialServer,
  ...serversAdapter.getInitialState({
    ids: initialServer ? [serverUrl(initialServer)] : [],
    entities: initialServer ? { [serverUrl(initialServer)]: initialServer } : {},
  }),
};

export const serversSlice = createSlice({
  name: "servers",
  initialState: initialState,
  reducers: {
    upsertServer: serversAdapter.upsertOne,
    removeServer: (state, action: PayloadAction<string>) => { 
      if (state.server?.host === action.payload) {
        state.server = state.entities.first;// undefined;
      }
      serversAdapter.removeOne(state, action);
    },
    reset: () => initialState,
    clearAlerts: (state) => {
      state.errorMessage = undefined;
      state.successMessage = undefined;
      state.error = undefined;
    },
    selectServer: (state, action: PayloadAction<JonlineServer | undefined>) => {
      state.server = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(upsertServer.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(upsertServer.fulfilled, (state, action) => {
      state.status = "loaded";
      // let server = action.payload
      // state.server = action.payload;
      // if (store.getState().accounts.account?.server.host != server.host || store.getState().accounts.account?.server.secure != server.secure) {
      //   store.dispatch(selectAccount(undefined));
      // }
      // getServerClient will update/upsert the server as a side effect.
      serversAdapter.upsertOne(state, action.payload);
      console.log(`Server ${action.payload.host} running Jonline v${action.payload.serviceVersion!.version} added.`);
      state.successMessage = `Server ${action.payload.host} running Jonline v${action.payload.serviceVersion!.version} added.`;
    });
    builder.addCase(upsertServer.rejected, (state, action) => {
      state.status = "errored";
      console.error(`Error connecting to ${action.meta.arg.host}.`, action.error);
      state.errorMessage = `Error connecting to ${action.meta.arg.host}.`;
      state.error = action.error as Error;
    });
  },
});

export const { selectServer, removeServer, clearAlerts } = serversSlice.actions;

export const { selectAll: selectAllServers } = serversAdapter.getSelectors();

export default serversSlice.reducer;
