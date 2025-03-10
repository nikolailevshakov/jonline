/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "jonline";

export enum FederationCredentials {
  REFRESH_TOKEN_ONLY = 0,
  REFRESH_TOKEN_AND_PASSWORD = 1,
  UNRECOGNIZED = -1,
}

export function federationCredentialsFromJSON(object: any): FederationCredentials {
  switch (object) {
    case 0:
    case "REFRESH_TOKEN_ONLY":
      return FederationCredentials.REFRESH_TOKEN_ONLY;
    case 1:
    case "REFRESH_TOKEN_AND_PASSWORD":
      return FederationCredentials.REFRESH_TOKEN_AND_PASSWORD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FederationCredentials.UNRECOGNIZED;
  }
}

export function federationCredentialsToJSON(object: FederationCredentials): string {
  switch (object) {
    case FederationCredentials.REFRESH_TOKEN_ONLY:
      return "REFRESH_TOKEN_ONLY";
    case FederationCredentials.REFRESH_TOKEN_AND_PASSWORD:
      return "REFRESH_TOKEN_AND_PASSWORD";
    case FederationCredentials.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetServiceVersionResponse {
  version: string;
}

/**
 * Asks the Jonline instance the request is sent to federate your account with one at `server`.
 * By default, a simple FederationRequest of `{server:, username:}` will create an account with
 * the username on the server, generate a permanent auth token, and use it. If you want Jonline
 * to store the remote Jonline account password, use `stored_credentials`. If you want to get the
 * password and/or auth token for the remote account yourself, use `returned_credentials`.
 */
export interface FederateRequest {
  /** The remote server to federate accounts with. */
  server: string;
  /**
   * Indicates whether the account already exists on the remote server.
   * When false, the instance will attempt to create the account on the remote server.
   */
  preexistingAccount: boolean;
  /** The username of the account on the remote server. */
  username: string;
  /**
   * When preexisting_account = true, will attempt to federate using that password.
   * When preexisting_account = false, will create a new account using that password.
   */
  password?:
    | string
    | undefined;
  /**
   * When preexisting_account = true, will attempt to federate using that password.
   * When preexisting_account = false, will create a new account using that password.
   */
  refreshToken?:
    | string
    | undefined;
  /** Request whether to store only the auth token, or the auth token and password. */
  storedCredentials: FederationCredentials;
  /** Request whether to return nothing, the auth token, or the auth token and password. */
  returnedCredentials?: FederationCredentials | undefined;
}

export interface FederateResponse {
  refreshToken?: string | undefined;
  password?: string | undefined;
}

export interface GetFederatedAccountsRequest {
  returnedCredentials?: FederationCredentials | undefined;
}

export interface GetFederatedAccountsResponse {
  federatedAccounts: FederatedAccount[];
}

export interface FederatedAccount {
  id: string;
  server: string;
  username: string;
  password?: string | undefined;
  refreshToken?: string | undefined;
}

function createBaseGetServiceVersionResponse(): GetServiceVersionResponse {
  return { version: "" };
}

export const GetServiceVersionResponse = {
  encode(message: GetServiceVersionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceVersionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetServiceVersionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetServiceVersionResponse {
    return { version: isSet(object.version) ? String(object.version) : "" };
  },

  toJSON(message: GetServiceVersionResponse): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetServiceVersionResponse>, I>>(base?: I): GetServiceVersionResponse {
    return GetServiceVersionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetServiceVersionResponse>, I>>(object: I): GetServiceVersionResponse {
    const message = createBaseGetServiceVersionResponse();
    message.version = object.version ?? "";
    return message;
  },
};

function createBaseFederateRequest(): FederateRequest {
  return {
    server: "",
    preexistingAccount: false,
    username: "",
    password: undefined,
    refreshToken: undefined,
    storedCredentials: 0,
    returnedCredentials: undefined,
  };
}

export const FederateRequest = {
  encode(message: FederateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.server !== "") {
      writer.uint32(10).string(message.server);
    }
    if (message.preexistingAccount === true) {
      writer.uint32(16).bool(message.preexistingAccount);
    }
    if (message.username !== "") {
      writer.uint32(26).string(message.username);
    }
    if (message.password !== undefined) {
      writer.uint32(34).string(message.password);
    }
    if (message.refreshToken !== undefined) {
      writer.uint32(42).string(message.refreshToken);
    }
    if (message.storedCredentials !== 0) {
      writer.uint32(48).int32(message.storedCredentials);
    }
    if (message.returnedCredentials !== undefined) {
      writer.uint32(56).int32(message.returnedCredentials);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FederateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFederateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.server = reader.string();
          break;
        case 2:
          message.preexistingAccount = reader.bool();
          break;
        case 3:
          message.username = reader.string();
          break;
        case 4:
          message.password = reader.string();
          break;
        case 5:
          message.refreshToken = reader.string();
          break;
        case 6:
          message.storedCredentials = reader.int32() as any;
          break;
        case 7:
          message.returnedCredentials = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FederateRequest {
    return {
      server: isSet(object.server) ? String(object.server) : "",
      preexistingAccount: isSet(object.preexistingAccount) ? Boolean(object.preexistingAccount) : false,
      username: isSet(object.username) ? String(object.username) : "",
      password: isSet(object.password) ? String(object.password) : undefined,
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : undefined,
      storedCredentials: isSet(object.storedCredentials) ? federationCredentialsFromJSON(object.storedCredentials) : 0,
      returnedCredentials: isSet(object.returnedCredentials)
        ? federationCredentialsFromJSON(object.returnedCredentials)
        : undefined,
    };
  },

  toJSON(message: FederateRequest): unknown {
    const obj: any = {};
    message.server !== undefined && (obj.server = message.server);
    message.preexistingAccount !== undefined && (obj.preexistingAccount = message.preexistingAccount);
    message.username !== undefined && (obj.username = message.username);
    message.password !== undefined && (obj.password = message.password);
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    message.storedCredentials !== undefined &&
      (obj.storedCredentials = federationCredentialsToJSON(message.storedCredentials));
    message.returnedCredentials !== undefined && (obj.returnedCredentials = message.returnedCredentials !== undefined
      ? federationCredentialsToJSON(message.returnedCredentials)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FederateRequest>, I>>(base?: I): FederateRequest {
    return FederateRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FederateRequest>, I>>(object: I): FederateRequest {
    const message = createBaseFederateRequest();
    message.server = object.server ?? "";
    message.preexistingAccount = object.preexistingAccount ?? false;
    message.username = object.username ?? "";
    message.password = object.password ?? undefined;
    message.refreshToken = object.refreshToken ?? undefined;
    message.storedCredentials = object.storedCredentials ?? 0;
    message.returnedCredentials = object.returnedCredentials ?? undefined;
    return message;
  },
};

function createBaseFederateResponse(): FederateResponse {
  return { refreshToken: undefined, password: undefined };
}

export const FederateResponse = {
  encode(message: FederateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.refreshToken !== undefined) {
      writer.uint32(10).string(message.refreshToken);
    }
    if (message.password !== undefined) {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FederateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFederateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.refreshToken = reader.string();
          break;
        case 2:
          message.password = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FederateResponse {
    return {
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : undefined,
      password: isSet(object.password) ? String(object.password) : undefined,
    };
  },

  toJSON(message: FederateResponse): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  create<I extends Exact<DeepPartial<FederateResponse>, I>>(base?: I): FederateResponse {
    return FederateResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FederateResponse>, I>>(object: I): FederateResponse {
    const message = createBaseFederateResponse();
    message.refreshToken = object.refreshToken ?? undefined;
    message.password = object.password ?? undefined;
    return message;
  },
};

function createBaseGetFederatedAccountsRequest(): GetFederatedAccountsRequest {
  return { returnedCredentials: undefined };
}

export const GetFederatedAccountsRequest = {
  encode(message: GetFederatedAccountsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.returnedCredentials !== undefined) {
      writer.uint32(8).int32(message.returnedCredentials);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFederatedAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFederatedAccountsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.returnedCredentials = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFederatedAccountsRequest {
    return {
      returnedCredentials: isSet(object.returnedCredentials)
        ? federationCredentialsFromJSON(object.returnedCredentials)
        : undefined,
    };
  },

  toJSON(message: GetFederatedAccountsRequest): unknown {
    const obj: any = {};
    message.returnedCredentials !== undefined && (obj.returnedCredentials = message.returnedCredentials !== undefined
      ? federationCredentialsToJSON(message.returnedCredentials)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFederatedAccountsRequest>, I>>(base?: I): GetFederatedAccountsRequest {
    return GetFederatedAccountsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFederatedAccountsRequest>, I>>(object: I): GetFederatedAccountsRequest {
    const message = createBaseGetFederatedAccountsRequest();
    message.returnedCredentials = object.returnedCredentials ?? undefined;
    return message;
  },
};

function createBaseGetFederatedAccountsResponse(): GetFederatedAccountsResponse {
  return { federatedAccounts: [] };
}

export const GetFederatedAccountsResponse = {
  encode(message: GetFederatedAccountsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.federatedAccounts) {
      FederatedAccount.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFederatedAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFederatedAccountsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.federatedAccounts.push(FederatedAccount.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFederatedAccountsResponse {
    return {
      federatedAccounts: Array.isArray(object?.federatedAccounts)
        ? object.federatedAccounts.map((e: any) => FederatedAccount.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetFederatedAccountsResponse): unknown {
    const obj: any = {};
    if (message.federatedAccounts) {
      obj.federatedAccounts = message.federatedAccounts.map((e) => e ? FederatedAccount.toJSON(e) : undefined);
    } else {
      obj.federatedAccounts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFederatedAccountsResponse>, I>>(base?: I): GetFederatedAccountsResponse {
    return GetFederatedAccountsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFederatedAccountsResponse>, I>>(object: I): GetFederatedAccountsResponse {
    const message = createBaseGetFederatedAccountsResponse();
    message.federatedAccounts = object.federatedAccounts?.map((e) => FederatedAccount.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFederatedAccount(): FederatedAccount {
  return { id: "", server: "", username: "", password: undefined, refreshToken: undefined };
}

export const FederatedAccount = {
  encode(message: FederatedAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.server !== "") {
      writer.uint32(18).string(message.server);
    }
    if (message.username !== "") {
      writer.uint32(26).string(message.username);
    }
    if (message.password !== undefined) {
      writer.uint32(34).string(message.password);
    }
    if (message.refreshToken !== undefined) {
      writer.uint32(42).string(message.refreshToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FederatedAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFederatedAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.server = reader.string();
          break;
        case 3:
          message.username = reader.string();
          break;
        case 4:
          message.password = reader.string();
          break;
        case 5:
          message.refreshToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FederatedAccount {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      server: isSet(object.server) ? String(object.server) : "",
      username: isSet(object.username) ? String(object.username) : "",
      password: isSet(object.password) ? String(object.password) : undefined,
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : undefined,
    };
  },

  toJSON(message: FederatedAccount): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.server !== undefined && (obj.server = message.server);
    message.username !== undefined && (obj.username = message.username);
    message.password !== undefined && (obj.password = message.password);
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<FederatedAccount>, I>>(base?: I): FederatedAccount {
    return FederatedAccount.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FederatedAccount>, I>>(object: I): FederatedAccount {
    const message = createBaseFederatedAccount();
    message.id = object.id ?? "";
    message.server = object.server ?? "";
    message.username = object.username ?? "";
    message.password = object.password ?? undefined;
    message.refreshToken = object.refreshToken ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
