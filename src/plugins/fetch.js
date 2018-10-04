const bodyMethods = ['PATCH', 'POST', 'PUT']

export default (config = {}) => ({
  baseUrl,
  method: _method,
  path,
  params: _params
}) => {
  const { headers: customHeaders = {}, ...rest } = config
  const method = _method.toUpperCase()
  const params = _params ? { body: JSON.stringify(_params) } : {}
  const headers = {
    headers: new Headers({
      ...(bodyMethods.includes(method) ? { 'Content-Type': 'application/json' } : {}),
      ...customHeaders
    })
  }

  return fetch(`${baseUrl}${path}`, {
    method,
    ...headers,
    ...params,
    ...rest
  })
    .then((response) => {
      if (response.ok) return response.json()
      return Promise.reject(new Error({ status: response.status, data: response.json() }))
    })
}
