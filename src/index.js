// @flow

import defaultPlugin from './plugins/fetch'

type Action = {
  error?: Object | string,
  opts?: RequestOpts,
  params?: Object,
  response?: Object,
  type: string
}

type Dispatch = (action: Action) => any

type GetState = () => Object

type InstanceOpts = {
  baseUrl: string,
  initialState?: { params?: ?Object },
  plugin?: (params: PluginParams) => Promise<any>,
  storeParams?: boolean
}

type Method = $Values<typeof METHODS>

type PluginParams = {
  baseUrl: string,
  method: Method,
  path: string,
  params: ?Object
}

type RequestOpts = {
  actionModifiers?: {
    begin: (getState: GetState) => Object,
    error: (error: any, getState: GetState) => Object,
    success: (response: any, getState: GetState) => Object
  },
  onError?: (error: any, getState: GetState) => any,
  onSuccess?: (response: any, getState: GetState) => any,
  resolver?: (state: Object, action: Action) => Object
}

type RequestParams = RequestOpts & {
  opts?: RequestOpts,
  params?: Object,
  verb?: string
}

type Status = $Values<typeof STATUSES>

const METHODS = Object.freeze({
  DELETE: 'delete',
  GET: 'get',
  POST: 'post',
  PUT: 'put'
})

const STATUSES = Object.freeze({
  BEGIN: 'BEGIN',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
})

export default class Duck {
  constructor(name: string, opts: InstanceOpts) {
    this.name = name
    this.opts = opts

    this.initialState = {
      ...opts.initialState || {},
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

  beginAction = (state: Object) => ({ ...state, loading: true })

  errorAction = (state: Object, { error }: Action) => ({ ...state, loading: false, error })

  successAction = (state: Object, action: Action) => {
    const storeParams = this.opts.storeParams ||
      (this.opts.initialState && !!this.opts.initialState.params)
    // $FlowFixMe - flow doesn't like this syntax
    const meta = { didLoad: true, loading: false, ...storeParams && { params: action.params } }

    return action.opts && action.opts.resolver
      ? { ...action.opts.resolver(state, action), ...meta }
      : { ...state, ...action.response, ...meta }
  }

  buildTypeString(verb: string, status: Status) {
    return `[${this.name}] ${verb}: ${status}`
  }

  buildTypesArray(status: Status) {
    return Object.keys(METHODS).map(method => this.buildTypeString(method.toUpperCase(), status))
  }

  createActionHandlers() {
    const beginTypes = this.buildTypesArray(STATUSES.BEGIN)
    const errorTypes = this.buildTypesArray(STATUSES.ERROR)
    const successTypes = this.buildTypesArray(STATUSES.SUCCESS)

    beginTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.beginAction }
    })

    errorTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.errorAction }
    })

    successTypes.forEach((type) => {
      this.actionHandlers = { ...this.actionHandlers, [type]: this.successAction }
    })
  }

  registerType(verb: string) {
    const customBegin = this.buildTypeString(verb, STATUSES.BEGIN)
    const customError = this.buildTypeString(verb, STATUSES.ERROR)
    const customSuccess = this.buildTypeString(verb, STATUSES.SUCCESS)

    this.actionHandlers = {
      ...this.actionHandlers,
      [customBegin]: this.beginAction,
      [customError]: this.errorAction,
      [customSuccess]: this.successAction
    }
  }

  request(
    method: Method,
    path: string,
    params?: Object = {},
    verb?: string,
    requestOpts: RequestOpts = {}
  ) {
    if (verb) this.registerType(verb)

    const actionType = `[${this.name}] ${verb || method.toUpperCase()}`
    const plugin = this.opts.plugin || defaultPlugin()
    const { actionModifiers: modifiers = {}, onError, onSuccess, ...opts } = requestOpts

    return (dispatch: Dispatch, getState: GetState): Promise<any> => {
      dispatch({ type: `${actionType}: ${STATUSES.BEGIN}`, ...modifiers.begin && modifiers.begin(getState) })

      return plugin({ baseUrl: this.opts.baseUrl, method, path, params })
        .then((response: any) => {
          if (onSuccess) onSuccess(response, getState)

          const type = `${actionType}: ${STATUSES.SUCCESS}`

          dispatch({ type, response, opts, params, ...modifiers.success && modifiers.success(response, getState) })
          return response
        })
        .catch((error) => {
          if (onError) onError(error, getState)

          const type = `${actionType}: ${STATUSES.ERROR}`

          dispatch({ type, error, ...modifiers.error && modifiers.error(error, getState) })
          return Promise.reject(error)
        })
    }
  }

  reducer = (state: Object = this.initialState, action: Action) => {
    const handler = this.actionHandlers[action.type]

    if (handler) return handler(state, action)
    return state
  }

  // Methods

  baseMethod(method: Method, path: string, { params, verb, ...opts }: RequestParams = {}) {
    return this.request(method, path, params, verb, opts)
  }

  delete(path: string, opts: RequestParams) {
    return this.baseMethod(METHODS.DELETE, path, opts)
  }

  get(path: string, opts: RequestParams) {
    return this.baseMethod(METHODS.GET, path, opts)
  }

  post(path: string, opts: RequestParams) {
    return this.baseMethod(METHODS.POST, path, opts)
  }

  put(path: string, opts: RequestParams) {
    return this.baseMethod(METHODS.PUT, path, opts)
  }
}
