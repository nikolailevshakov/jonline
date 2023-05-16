import { grpc } from "@improbable-eng/grpc-web";
import { CreateAccountRequest, ExpirableToken, LoginRequest } from "@jonline/api";
import { formatError } from "@jonline/ui";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
  PayloadAction
} from "@reduxjs/toolkit";
import moment from "moment";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getServerClient, resetCredentialedData, store } from "../store";
import { AccountOrServer, JonlineAccount, JonlineCredentialClient, JonlineServer } from "../types";
import { serverID } from "./servers";
import { getCookie, setCookie } from 'typescript-cookie'

let _accessFetchLock = false;
let _newAccessToken: ExpirableToken | undefined = undefined;
let _newRefreshToken: ExpirableToken | undefined = undefined;
export async function getCredentialClient(accountOrServer: AccountOrServer): Promise<JonlineCredentialClient> {
  let { account, server } = accountOrServer;
  if (!account) {
    setCookie('jonline_access_token', null);
    return getServerClient(server!);
  } else {
    const client = await getServerClient(account.server);
    const metadata = new grpc.Metadata();
    const accessExpiresAt = moment.utc(account.accessToken.expiresAt);
    const now = moment.utc();
    const expired = accessExpiresAt.subtract(1, 'minutes').isBefore(now);
    if (expired) {
      console.log(`Access token expired, refreshing..., now=${now}, expiresAt=${accessExpiresAt}`)
      let newAccessToken: ExpirableToken | undefined = undefined;
      let newRefreshToken: ExpirableToken | undefined = undefined;
      while (_accessFetchLock) {
        await new Promise(resolve => setTimeout(resolve, 100));
        newAccessToken = _newAccessToken;
        newRefreshToken = _newRefreshToken;
      }
      const newTokenExpired = !newAccessToken ||
        moment.utc(newAccessToken!.expiresAt).subtract(1, 'minutes').isBefore(now);
      if (newTokenExpired) {
        _accessFetchLock = true;
        let { accessToken: fetchedAccessToken, refreshToken: fetchedRefreshToken } = await client.accessToken({ refreshToken: account.refreshToken!.token });
        newAccessToken = fetchedAccessToken!;
        _newAccessToken = newAccessToken;
        newRefreshToken = fetchedRefreshToken!;
        _newRefreshToken = newRefreshToken;
        _accessFetchLock = false;
        account = { ...account, accessToken: newAccessToken!, refreshToken: newRefreshToken ?? account.refreshToken };
        store.dispatch(accountsSlice.actions.upsertAccount(account));
      }
      // account = { ...account, accessToken: newAccessToken! };
      // store.dispatch(accountsSlice.actions.upsertAccount(account));
    }
    metadata.append('authorization', account.accessToken.token);
    // setCookie('jonline_access_token', account.accessToken.token);
    return { ...client, credential: metadata };
  }
}

export interface AccountsState {
  status: "unloaded" | "loading" | "loaded" | "errored";
  error?: Error;
  successMessage?: string;
  errorMessage?: string;
  account?: JonlineAccount;
  ids: EntityId[];
  entities: Dictionary<JonlineAccount>;
}

export function accountId(account: JonlineAccount | undefined): string | undefined {
  if (!account) return undefined;

  return `${serverID(account.server)}-${account.user.id}`;
}
const accountsAdapter = createEntityAdapter<JonlineAccount>({
  selectId: (account) => accountId(account)!,
});

export type CreateAccount = JonlineServer & CreateAccountRequest;
export const createAccount = createAsyncThunk<JonlineAccount, CreateAccount>(
  "accounts/create",
  async (createAccountRequest) => {
    let client = await getServerClient(createAccountRequest);
    let { refreshToken, accessToken, user } = await client.createAccount(createAccountRequest);
    let metadata = new grpc.Metadata();
    metadata.append('authorization', accessToken!.token)
    user = user || await client.getCurrentUser({}, metadata);
    return {
      id: uuidv4(),
      user: user!,
      refreshToken: refreshToken!,
      accessToken: accessToken!,
      server: { ...createAccountRequest }
    };
  }
);

export type Login = JonlineServer & LoginRequest;
export const login = createAsyncThunk<JonlineAccount, Login>(
  "accounts/login",
  async (loginRequest) => {
    let client = await getServerClient(loginRequest);
    let { refreshToken, accessToken, user } = await client.login(loginRequest);
    let metadata = new grpc.Metadata();
    metadata.append('authorization', accessToken!.token)
    user = user || await client.getCurrentUser({}, metadata);
    return {
      id: uuidv4(),
      user: user!,
      refreshToken: refreshToken!,
      accessToken: accessToken!,
      server: { ...loginRequest }
    };
  }
);

const initialState: AccountsState = {
  status: "unloaded",
  error: undefined,
  ...accountsAdapter.getInitialState(),
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: initialState,//{ ...initialState, ...JSON.parse(localStorage.getItem("accounts")) },
  reducers: {
    upsertAccount: (state, action: PayloadAction<JonlineAccount>) => {
      accountsAdapter.upsertOne(state, action.payload);
      if (accountId(state.account) === accountId(action.payload)) {
        state.account = action.payload;
      }
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      if (accountId(state.account) === action.payload) {
        state.account = undefined;
      }
      accountsAdapter.removeOne(state, action);
    },
    resetAccounts: () => initialState,
    selectAccount: (state, action: PayloadAction<JonlineAccount | undefined>) => {
      if (accountId(state.account) != accountId(action.payload)) {
        resetCredentialedData();
      }
      _newAccessToken = undefined;
      state.account = action.payload;
    },
    clearAccountAlerts: (state) => {
      state.errorMessage = undefined;
      state.successMessage = undefined;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAccount.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(createAccount.fulfilled, (state, action) => {
      state.status = "loaded";
      state.account = action.payload;
      accountsAdapter.upsertOne(state, action.payload);
      state.successMessage = `Created account ${action.payload.user.username}`;
    });
    builder.addCase(createAccount.rejected, (state, action) => {
      state.status = "errored";
      state.error = action.error as Error;
      state.errorMessage = formatError(action.error as Error);
      state.error = action.error as Error;
    });
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "loaded";
      state.account = action.payload;
      accountsAdapter.upsertOne(state, action.payload);
      state.successMessage = `Logged in as ${action.payload.user.username}`;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "errored";
      state.error = action.error as Error;
      state.status = "errored";
      state.error = action.error as Error;
      state.errorMessage = formatError(action.error as Error);
      state.error = action.error as Error;
    });
  },
});

export const { selectAccount, removeAccount, clearAccountAlerts, resetAccounts } = accountsSlice.actions;

export const { selectAll: selectAllAccounts, selectTotal: selectAccountTotal } = accountsAdapter.getSelectors();
export const accountsReducer = accountsSlice.reducer;
export default accountsReducer;
