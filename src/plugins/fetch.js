/* eslint object-curly-newline: 0 */

export default (config = {}) => ({
  baseUrl,
  method,
  path,
  params
}) => fetch(`${baseUrl}${path}`, {
  method: method.toUpperCase(),
  body: params,
  ...config
})
  .then((response) => {
    if (response.ok) return response.json()
    return Promise.reject(new Error({ status: response.status, data: response.json() }))
  })
