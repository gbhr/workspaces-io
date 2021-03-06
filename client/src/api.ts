/**
 * Typed Axios shims for interacting with workspace-io backend.
 */

import axios, { AxiosRequestConfig } from 'axios';

function config(base: AxiosRequestConfig = {}): AxiosRequestConfig {
  return {
    ...base,
    baseURL: '/api',
  };
}

interface BaseModel {
  id: string;
  created: string;
}

interface User extends BaseModel {
  email: string;
  username: string;
}

interface Root extends BaseModel {
  root_type: 'public' | 'private' | 'unmanaged';
  bucket: string;
  base_path: string;
  node_id: string;
}

interface Workspace extends BaseModel {
  name: string;
  base_path?: string;
  owner_id: string;
  root_id: string;
  owner: User;
  root: Root;
}

interface ApiKey extends BaseModel {
  key_id: string;
  secret?: string;
  user: User;
}

interface SearchResult {
  hits: {
    max_score: number;
    total: {
      value: number;
      relationship: string;
    };
    took: number;
    hits: {
      _source: {
        workspace_name: string;
        owner_name: string;
        path: string;
      };
    }[];
  };
}

async function usersMe(): Promise<User> {
  const { data } = await axios.get<User>('user/me', config());
  return data;
}

async function apikeyList(): Promise<ApiKey[]> {
  const { data } = await axios.get<ApiKey[]>('apikey', config());
  return data;
}

async function apikeyCreate(): Promise<ApiKey> {
  const { data } = await axios.request<ApiKey>(config({
    method: 'POST',
    url: 'apikey',
  }));
  return data;
}

async function apikeyRevokeAll(): Promise<void> {
  return await axios.delete('apikey', config());
}

async function search(query: string): Promise<SearchResult> {
  const { data } = await axios.get<SearchResult>('search', config({
    params: { q: query },
  }));
  return data;
}

async function workspacesSearch(name?: string, owner_id?: string): Promise<Workspace[]> {
  const { data } = await axios.get<Workspace[]>('workspace', config({
    params: { name, owner_id },
  }));
  return data;
}

export {
  /* methods */
  apikeyCreate,
  apikeyRevokeAll,
  apikeyList,
  search,
  usersMe,
  workspacesSearch,
  /* Interfaces */
  ApiKey,
  User,
  Root,
  SearchResult,
  Workspace,
};
