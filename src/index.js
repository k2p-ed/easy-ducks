// @flow

import { methods, statuses } from './constants'
import defaultPlugin from './plugins/fetch'

import type {
  Action, Config, Dispatch, GetState, Method,
  RequestParams, State, Status, ThunkAction
} from './types'

export class DuckFactory {
  constructor(config: Config) {
    this.config = config
  }

  config = {}

  create(name: string, opts?: Config) {
    return new Duck(name, { ...this.config, ...(opts || {}) })
  }
}

export class Duck {
  constructor(name: string, opts: Config) {
    this.opts = opts
    this.name = name
    this.initialState = {
      ...this.opts.initialState || {},
      error: null,
      didLoad: false,
      loading: false
    }

    this.createActionHandlers()
  }

  actionHandlers = {}

  initialState = {}

  name = ''

  opts = {}

  actions = {
    begin: (state: State) => ({ ...state, loading: true }),
    error: (state: State, { error }: Action) => ({ ...state, loading: false, error }),
    success: (state: State, action: Action) => {
      const storeParams = this.opts.storeParams || !!this.opts.initialState?.params
      const meta = {
        didLoad: true,
        loading: false,
        ...(storeParams ? { params: action.params } : {})
      }

      return action.opts && action.opts.resolver
        ? { ...action.opts.resolver(state, action), ...meta }
        : { ...state, ...action.response, ...meta }
    }
  }

  buildTypeString(verb: string, status: Status) {
    return `[${this.name}] ${verb}: ${status}`
  }

  buildTypesArray(status: Status): string[] {
    return Object.keys(methods).map(method => this.buildTypeString(method, status))
  }

  createActionHandlers() {
    const beginTypes = this.buildTypesArray(statuses.BEGIN)
    const errorTypes = this.buildTypesArray(statuses.ERROR)
    const successTypes = this.buildTypesArray(statuses.SUCCESS)

    beginTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.actions.begin }
    })

    errorTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.actions.error }
    })

    successTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.actions.success }
    })
  }

  registerType(verb: string) {
    const customBegin = this.buildTypeString(verb, statuses.BEGIN)
    const customError = this.buildTypeString(verb, statuses.ERROR)
    const customSuccess = this.buildTypeString(verb, statuses.SUCCESS)

    this.actionHandlers = {
      ...this.actionHandlers,
      [customBegin]: this.actions.begin,
      [customError]: this.actions.error,
      [customSuccess]: this.actions.success
    }
  }

  request(method: Method, path: string, { params, verb, ...requestOpts }: RequestParams = {}): ThunkAction {
    if (verb) this.registerType(verb)

    const actionType = `[${this.name}] ${verb || method.toUpperCase()}`
    const plugin = this.opts.plugin || defaultPlugin()
    const {
      actionModifiers: modifiers = {},
      onError,
      onSuccess,
      ...opts
    } = requestOpts

    return (dispatch: Dispatch, getState: GetState): Promise<any> => {
      dispatch({ type: `${actionType}: ${statuses.BEGIN}`, ...modifiers.begin && modifiers.begin(getState) })

      return plugin({
        baseUrl: this.opts.baseUrl,
        method,
        path,
        params
      })
        .then((response: any) => {
          if (onSuccess) onSuccess(dispatch, getState, response)

          const type = `${actionType}: ${statuses.SUCCESS}`

          dispatch({
            response,
            type,
            opts,
            ...(params ? { params } : {}),
            ...modifiers.success && modifiers.success(response, getState)
          })

          return response
        })
        .catch((error) => {
          if (onError) onError(dispatch, getState, error)

          const type = `${actionType}: ${statuses.ERROR}`

          dispatch({
            type,
            error,
            ...modifiers.error && modifiers.error(error, getState)
          })

          return Promise.reject(error)
        })
    }
  }

  reducer = (state: State = this.initialState, action: Action) => {
    const handler = this.actionHandlers[action.type]

    return handler ? handler(state, action) : state
  }

  delete(path: string, opts?: RequestParams) {
    return this.request(methods.DELETE, path, opts)
  }

  get(path: string, opts?: RequestParams) {
    return this.request(methods.GET, path, opts)
  }

  patch(path: string, opts?: RequestParams) {
    return this.request(methods.PATCH, path, opts)
  }

  post(path: string, opts?: RequestParams) {
    return this.request(methods.POST, path, opts)
  }

  put(path: string, opts?: RequestParams) {
    return this.request(methods.PUT, path, opts)
  }
}
