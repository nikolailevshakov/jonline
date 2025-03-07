import { Empty, Follow, GetEventsResponse, GetPostsResponse, GetUsersRequest, GetUsersResponse, Moderation, User, UserListingType } from "@jonline/api";
import {
  AsyncThunk,
  createAsyncThunk
} from "@reduxjs/toolkit";
import { AccountOrServer, getCredentialClient, store, usersAdapter } from "..";

export const defaultUserListingType = UserListingType.EVERYONE;

export type LoadUsersRequest = AccountOrServer & { page?: number, listingType?: UserListingType };
export const loadUsersPage: AsyncThunk<GetUsersResponse, LoadUsersRequest, any> = createAsyncThunk<GetUsersResponse, LoadUsersRequest>(
  "users/loadPage",
  async (request) => {
    let client = await getCredentialClient(request);
    const getUserRequest = GetUsersRequest.create({
      page: request.page,
      listingType: request.listingType ?? defaultUserListingType,
    });
    return await client.getUsers(getUserRequest, client.credential);
  }
);

export type LoadUser = { id: string } & AccountOrServer;
const _loadingUserIds = new Set<string>();
export const loadUser: AsyncThunk<User, LoadUser, any> = createAsyncThunk<User, LoadUser>(
  "users/loadById",
  async (request) => {
    let user: User | undefined = undefined;
    if (_loadingUserIds.has(request.id)) {
      throw 'Already loading user...';
    }
    // while (_loadingUserIds.has(request.id)) {
    //   await new Promise(resolve => setTimeout(resolve, 100));
    //   user = usersAdapter.getSelectors().selectById(store.getState().users, request.id);
    // }
    if (store.getState().users.failedUserIds.includes(request.id)) {
      throw 'User not found';
    }
    if (!user) {
      _loadingUserIds.add(request.id);
      const client = await getCredentialClient(request);
      const response = await client.getUsers(GetUsersRequest.create({ userId: request.id }), client.credential);
      _loadingUserIds.delete(request.id);
      if (response.users.length == 0) throw 'User not found';

      user = response.users[0]!;
    }
    return user;
  }
);

export type LoadUsername = { username: string } & AccountOrServer;
const _loadingUsernames = new Set<string>();
export const loadUsername: AsyncThunk<User, LoadUsername, any> = createAsyncThunk<User, LoadUsername>(
  "users/loadByName",
  async (request) => {
    let user: User | undefined = undefined;
    while (_loadingUsernames.has(request.username)) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const userId = store.getState().users.usernameIds[request.username];
      user = userId ? usersAdapter.getSelectors().selectById(store.getState().users, userId) : undefined;
    }
    if (!user) {
      _loadingUsernames.add(request.username);
      const client = await getCredentialClient(request);
      const response = await client.getUsers(GetUsersRequest.create({ username: request.username }), client.credential);
      _loadingUsernames.delete(request.username);
      if (response.users.length == 0) throw 'User not found';

      user = response.users[0]!;
    }
    return user;
  }
);

export type LoadUserPosts = AccountOrServer & { userId: string };
export const loadUserPosts: AsyncThunk<GetPostsResponse, LoadUserPosts, any> = createAsyncThunk<GetPostsResponse, LoadUserPosts>(
  "users/loadPosts",
  async (request) => {
    let client = await getCredentialClient(request);
    const result = await client.getPosts({ authorUserId: request.userId }, client.credential);
    return result;
  }
);
export type LoadUserEvents = AccountOrServer & { userId: string };
export const loadUserEvents: AsyncThunk<GetEventsResponse, LoadUserEvents, any> = createAsyncThunk<GetEventsResponse, LoadUserEvents>(
  "users/loadPosts",
  async (request) => {
    let client = await getCredentialClient(request);
    const result = await client.getEvents({ authorUserId: request.userId }, client.credential);
    return result;
  }
);


export type UpdateUser = User & AccountOrServer;
export const userSaved = 'User Saved';
export const updateUser: AsyncThunk<User, UpdateUser, any> = createAsyncThunk<User, UpdateUser>(
  "users/update",
  async (request) => {
    const client = await getCredentialClient(request);
    const updatedUser = { ...request };
    const user = await client.updateUser(updatedUser, client.credential);
    return user;
  }
);

export type FollowUnfollowUser = { userId: string, follow: boolean } & AccountOrServer;
export const followUnfollowUser: AsyncThunk<Follow | undefined, FollowUnfollowUser, any> = createAsyncThunk<Follow | undefined, FollowUnfollowUser>(
  "users/followUnfollow",
  async (request) => {
    const client = await getCredentialClient(request);
    const follow = { userId: request.account!.user.id, targetUserId: request.userId };
    if (request.follow) {
      return await client.createFollow(follow, client.credential);
    } else {
      await client.deleteFollow(follow, client.credential);
      return undefined;
    }
  });

export type RespondToFollowRequest = { userId: string, accept: boolean } & AccountOrServer;
export const respondToFollowRequest: AsyncThunk<Follow | undefined, RespondToFollowRequest, any> = createAsyncThunk<Follow | undefined, RespondToFollowRequest>(
  "users/respondToFollowRequest",
  async (request) => {
    const client = await getCredentialClient(request);
    const follow = { targetUserId: request.account!.user.id, userId: request.userId, targetUserModeration: request.accept ? Moderation.APPROVED : Moderation.REJECTED };
    if (request.accept) {
      return await client.updateFollow(follow, client.credential);
    } else {
      await client.deleteFollow(follow, client.credential);
      return undefined;
    }
  });


export type DeleteUser = User & AccountOrServer;
export const deleteUser: AsyncThunk<void, DeleteUser, any> = createAsyncThunk<void, DeleteUser>(
  "users/delete",
  async (request) => {
    const client = await getCredentialClient(request);
    const updatedUser = { ...request };
    await client.deleteUser(updatedUser, client.credential);
  }
);