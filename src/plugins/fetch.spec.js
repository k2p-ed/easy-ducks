import plugin from './fetch'

describe('plugins/fetch', () => {
  const mockResponse = { foo: 'bar' }

  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(mockResponse))
  })

  afterEach(() => {
    fetch.resetMocks()
  })

  context('GET', () => {
    const args = {
      baseUrl: 'test-base-url',
      method: 'GET',
      path: 'test-path'
    }

    it('should call fetch with the GET method', () => {
      plugin()(args)
      expect(fetch).toHaveBeenCalledWith(`${args.baseUrl}${args.path}`, {
        method: args.method,
        headers: new Headers({})
      })
    })

    it('should return the correct parsed response', async () => {
      const response = await plugin()(args)
      expect(response).toEqual(mockResponse)
    })
  })

  context('DELETE', () => {
    const args = {
      baseUrl: 'test-base-url',
      method: 'DELETE',
      path: 'test-path'
    }

    it('should call fetch with the DELETE method', () => {
      plugin()(args)
      expect(fetch).toHaveBeenCalledWith(`${args.baseUrl}${args.path}`, {
        method: args.method,
        headers: new Headers({})
      })
    })

    it('should return the correct parsed response', async () => {
      const response = await plugin()(args)
      expect(response).toEqual(mockResponse)
    })
  })
  context('PATCH', () => {
    const args = {
      baseUrl: 'test-base-url',
      method: 'PATCH',
      path: 'test-path',
      params: { foo: 'bar' }
    }

    it('should call fetch with the PATCH method', () => {
      plugin()(args)
      expect(fetch).toHaveBeenCalledWith(`${args.baseUrl}${args.path}`, {
        method: args.method,
        body: JSON.stringify(args.params),
        headers: new Headers({ 'content-type': 'application/json' })
      })
    })

    it('should return the correct parsed response', async () => {
      const response = await plugin()(args)
      expect(response).toEqual(mockResponse)
    })
  })

  context('POST', () => {
    const args = {
      baseUrl: 'test-base-url',
      method: 'POST',
      path: 'test-path',
      params: { foo: 'bar' }
    }

    it('should call fetch with the POST method', () => {
      plugin()(args)
      expect(fetch).toHaveBeenCalledWith(`${args.baseUrl}${args.path}`, {
        method: args.method,
        body: JSON.stringify(args.params),
        headers: new Headers({ 'content-type': 'application/json' })
      })
    })

    it('should return the correct parsed response', async () => {
      const response = await plugin()(args)
      expect(response).toEqual(mockResponse)
    })
  })

  context('PUT', () => {
    const args = {
      baseUrl: 'test-base-url',
      method: 'PUT',
      path: 'test-path',
      params: { foo: 'bar' }
    }

    it('should call fetch with the PUT method', () => {
      plugin()(args)
      expect(fetch).toHaveBeenCalledWith(`${args.baseUrl}${args.path}`, {
        method: args.method,
        body: JSON.stringify(args.params),
        headers: new Headers({ 'content-type': 'application/json' })
      })
    })

    it('should return the correct parsed response', async () => {
      const response = await plugin()(args)
      expect(response).toEqual(mockResponse)
    })
  })
})
