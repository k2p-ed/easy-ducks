// @flow

import { methods, statuses } from './constants'

export type Action = {
  error?: Object | string,
  opts?: RequestOpts,
  params?: Object,
  response?: Object,
  type: string
}

export type State = Object

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any

export type GetState = () => State

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any

export type PromiseAction = Promise<Action>

export type RequestOpts = {
  actionModifiers?: {
    begin: (getState: GetState) => State,
    error: (error: any, getState: GetState) => Object,
    success: (response: any, getState: GetState) => Object
  },
  onError?: (dispatch: Dispatch, getState: GetState, error: any) => any,
  onSuccess?: (dispatch: Dispatch, getState: GetState, response: any) => any,
  resolver?: (state: State, action: Action) => Object
}

export type RequestParams = RequestOpts & {
  opts?: RequestOpts,
  params?: Object,
  verb?: string
}

export type PluginParams = {
  baseUrl: string,
  method: Method,
  path: string,
  params: ?Object
}

export type Config = {
  baseUrl: string,
  initialState?: { params?: ?Object },
  plugin?: (params: PluginParams) => Promise<any>,
  storeParams?: boolean
}

export type Method = $Values<typeof methods>

export type Status = $Values<typeof statuses>
