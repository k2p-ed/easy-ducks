import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { Duck, DuckFactory } from '..'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Duck', () => {
  const baseUrl = 'test-baseUrl'
  const path = 'test-path'
  const body = { foo: 'bar' }
  const mockResponse = { mock: 'response' }

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('should dispatch the correct actions for a DELETE request', async () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify(mockResponse))
    await store.dispatch(duck.delete(path))

    const actions = store.getActions()

    expect(actions[0]).toEqual({
      type: '[test] DELETE: BEGIN'
    })
    expect(actions[1]).toEqual({
      opts: {},
      type: '[test] DELETE: SUCCESS',
      response: mockResponse
    })
  })

  it('should dispatch the correct actions for a GET request', async () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify(mockResponse))
    await store.dispatch(duck.get(path))

    const actions = store.getActions()

    expect(actions[0]).toEqual({
      type: '[test] GET: BEGIN'
    })
    expect(actions[1]).toEqual({
      opts: {},
      type: '[test] GET: SUCCESS',
      response: mockResponse
    })
  })

  it('should dispatch the correct actions for a PATCH request', async () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify(mockResponse))

    await store.dispatch(duck.patch(path, { params: body }))

    const actions = store.getActions()

    expect(actions[0]).toEqual({
      type: '[test] PATCH: BEGIN'
    })
    expect(actions[1]).toEqual({
      opts: {},
      params: { ...body },
      type: '[test] PATCH: SUCCESS',
      response: mockResponse
    })
  })

  it('should dispatch the correct actions for a POST request', async () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify(mockResponse))
    await store.dispatch(duck.post(path, { params: body }))

    const actions = store.getActions()

    expect(actions[0]).toEqual({
      type: '[test] POST: BEGIN'
    })
    expect(actions[1]).toEqual({
      opts: {},
      params: { ...body },
      type: '[test] POST: SUCCESS',
      response: mockResponse
    })
  })

  it('should dispatch the correct actions for a PUT request', async () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify(mockResponse))

    await store.dispatch(duck.put(path, { params: body }))

    const actions = store.getActions()

    expect(actions[0]).toEqual({
      type: '[test] PUT: BEGIN'
    })
    expect(actions[1]).toEqual({
      opts: {},
      params: { ...body },
      type: '[test] PUT: SUCCESS',
      response: mockResponse
    })
  })

  context('when the request is successful', () => {
    it('should update the store with the response', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: SUCCESS'
      const response = { foo: 'bar' }
      const result = duck.reducer({}, { type, response })

      expect(result).toEqual({ foo: 'bar', didLoad: true, loading: false })
    })

    context('when a onSuccess callback is provided', () => {
      it('should execute the onSuccess callback', async () => {
        const store = mockStore()
        const duck = new Duck('test', { baseUrl })
        const response = { foo: 'bar' }
        const onSuccess = jest.fn()

        fetch.mockResponse(JSON.stringify(response))

        await store.dispatch(duck.get(path, { onSuccess }))

        // TODO: figure out how to assert that was called with dispatch as first argument
        expect(onSuccess).toHaveBeenCalledWith(expect.anything(), store.getState, response)
      })
    })
  })

  context('when the request fails', () => {
    it('should dispatch the correct actions', async () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const error = new Error('fake error message')
      const expectedActions = [
        { type: '[test] GET: BEGIN' },
        { type: '[test] GET: ERROR', error }
      ]

      fetch.mockReject(error)

      try {
        await store.dispatch(duck.get(path))
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions)
      }
    })

    it('should update the store with the error', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: ERROR'
      const error = new Error('fake error message')
      const result = duck.reducer({}, { type, error })

      expect(result).toEqual({ error, loading: false })
    })

    context('when a onError callback is provided', () => {
      it('should execute the onError callback', async () => {
        const store = mockStore()
        const duck = new Duck('test', { baseUrl })
        const error = new Error('test-error')
        const onError = jest.fn()

        fetch.mockReject(error)

        try {
          await store.dispatch(duck.get(path, { onError }))
        } catch (e) {
          // TODO: figure out how to assert that was called with dispatch as first argument
          expect(onError).toHaveBeenCalledWith(expect.anything(), store.getState, error)
        }
      })
    })
  })

  context('when a custom verb is provided', () => {
    it('should dispatch the correct action types', async () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const response = { foo: 'bar' }
      const expectedActions = [
        { type: '[test] FOO: BEGIN' },
        { type: '[test] FOO: SUCCESS', opts: {}, response }
      ]

      fetch.mockResponse(JSON.stringify(response))

      await store.dispatch(duck.get(path, { verb: 'FOO' }))

      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  context('when a custom resolver is provided', () => {
    it('should call the resolver with state and action arguments', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: SUCCESS'
      const response = { foo: 'bar' }
      const resolver = jest.fn()
      const action = { type, response, opts: { resolver } }
      duck.reducer({}, action)

      expect(resolver).toHaveBeenCalledWith({}, action)
    })

    it('should use the resolver function to update the store', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: SUCCESS'
      const response = { foo: 'bar' }
      const resolver = (state, action) => ({ ...state, customKey: action.response })
      const action = { type, response, opts: { resolver } }
      const result = duck.reducer({}, action)

      expect(result).toEqual({ customKey: response, didLoad: true, loading: false })
    })
  })

  context('when a "begin" action modifier is provided', () => {
    it('should dispatch the correct action', () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const begin = jest.fn().mockReturnValue({ foo: 'bar' })

      fetch.mockResponse(JSON.stringify({}))

      store.dispatch(duck.get(path, {
        actionModifiers: { begin }
      }))

      expect(begin).toHaveBeenCalledWith(store.getState)
      expect(store.getActions()[0]).toEqual({ type: '[test] GET: BEGIN', foo: 'bar' })
    })
  })

  context('when a "error" action modifier is provided', () => {
    it('should dispatch the correct action', async () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const mockError = new Error('fake error message')
      const error = jest.fn().mockReturnValue({ foo: 'bar' })

      fetch.mockReject(mockError)

      try {
        await store.dispatch(duck.get(path, {
          actionModifiers: { error }
        }))
      } catch (e) {
        expect(error).toHaveBeenCalledWith(mockError, store.getState)
        expect(store.getActions()[1]).toEqual({ type: '[test] GET: ERROR', foo: 'bar', error: mockError })
      }
    })
  })

  context('when a "success" action modifier is provided', () => {
    it('should dispatch the correct action', async () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const success = jest.fn().mockReturnValue(mockResponse)
      const expected = {
        ...mockResponse,
        opts: {},
        type: '[test] GET: SUCCESS',
        response: mockResponse
      }

      fetch.mockResponse(JSON.stringify(mockResponse))

      await store.dispatch(duck.get(path, {
        actionModifiers: { success }
      }))

      expect(success).toHaveBeenCalledWith(mockResponse, store.getState)
      expect(store.getActions()[1]).toEqual(expected)
    })
  })

  context('when global config options are defined', () => {
    const globalBaseUrl = 'test-global-baseUrl'
    const duckFactory = new DuckFactory({ baseUrl: globalBaseUrl })

    it('should use the global config options', async () => {
      const store = mockStore()
      const duck = duckFactory.create()

      fetch.mockResponse(JSON.stringify(mockResponse))

      await store.dispatch(duck.get(path))

      expect(fetch).toHaveBeenCalledWith(`${globalBaseUrl}${path}`, {
        method: 'GET',
        headers: new Headers({})
      })
    })

    context('and when instance options are defined', () => {
      it('should override the global config options', async () => {
        const store = mockStore()
        const localBaseUrl = 'test-local-baseUrl'
        const duck = duckFactory.create('test', { baseUrl: localBaseUrl })

        fetch.mockResponse(JSON.stringify({}))

        await store.dispatch(duck.get(path))

        expect(fetch).toHaveBeenCalledWith(`${localBaseUrl}${path}`, {
          method: 'GET',
          headers: new Headers({})
        })
      })
    })
  })
})
