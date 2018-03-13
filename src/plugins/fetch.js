export default (config = {}) => ({ baseUrl, method, path, params }) => fetch(`${baseUrl}${path}`, {
  method: method.toUpperCase(),
  body: params,
  ...config
})
  .then((response) => {
    if (response.ok) return response.json()
    return Promise.reject({ status: response.status, data: response.json() })
  })
