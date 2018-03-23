import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Duck from '../'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Duck', () => {
  const baseUrl = 'test-baseUrl'
  const path = 'test-path'
  const body = { foo: 'bar' }

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('should make a DELETE request to the correct url', () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify({}))

    return store.dispatch(duck.delete(path))
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}${path}`, { body: {}, method: 'DELETE' })
        expect(store.getActions()[0]).toEqual({ type: '[test] DELETE: BEGIN' })
      })
  })

  it('should make a GET request to the correct url', () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify({}))

    return store.dispatch(duck.get(path))
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}${path}`, { body: {}, method: 'GET' })
        expect(store.getActions()[0]).toEqual({ type: '[test] GET: BEGIN' })
      })
  })

  it('should make a POST request to the correct url', () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify({}))

    return store.dispatch(duck.post(path, { params: body }))
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}${path}`, { body, method: 'POST' })
        expect(store.getActions()[0]).toEqual({ type: '[test] POST: BEGIN' })
      })
  })

  it('should make a PUT request to the correct url', () => {
    const store = mockStore()
    const duck = new Duck('test', { baseUrl })

    fetch.mockResponse(JSON.stringify({}))

    return store.dispatch(duck.put(path, { params: body }))
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}${path}`, { body, method: 'PUT' })
        expect(store.getActions()[0]).toEqual({ type: '[test] PUT: BEGIN' })
      })
  })

  describe('when the request is successful', () => {
    it('should dispatch the correct actions', () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const response = { foo: 'bar' }
      const expectedActions = [
        { type: '[test] GET: BEGIN' },
        { type: '[test] GET: SUCCESS', opts: {}, params: {}, response }
      ]

      fetch.mockResponse(JSON.stringify(response))

      return store.dispatch(duck.get(path))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should update the store with the response', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: SUCCESS'
      const response = { foo: 'bar' }
      const result = duck.reducer({}, { type, response })

      expect(result).toEqual({ foo: 'bar', didLoad: true, loading: false })
    })
  })

  describe('when the request fails', () => {
    it('should dispatch the correct actions', () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const error = new Error('fake error message')
      const expectedActions = [
        { type: '[test] GET: BEGIN' },
        { type: '[test] GET: ERROR', opts: {}, params: {}, error }
      ]

      fetch.mockReject(error)

      return store.dispatch(duck.get(path))
        .catch(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should update the store with the error', () => {
      const duck = new Duck('test', { baseUrl })
      const type = '[test] GET: ERROR'
      const error = new Error('fake error message')
      const result = duck.reducer({}, { type, error })

      expect(result).toEqual({ error, loading: false })
    })
  })

  describe('when a custom verb is provided', () => {
    it('should dispatch the correct action types', () => {
      const store = mockStore()
      const duck = new Duck('test', { baseUrl })
      const response = { foo: 'bar' }
      const expectedActions = [
        { type: '[test] FOO: BEGIN' },
        { type: '[test] FOO: SUCCESS', opts: {}, params: {}, response }
      ]

      fetch.mockResponse(JSON.stringify(response))

      return store.dispatch(duck.get(path, { verb: 'FOO' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })
  })

  describe('when a custom resolver is provided', () => {
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
})
