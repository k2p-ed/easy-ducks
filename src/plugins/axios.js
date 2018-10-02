import axios from 'axios'

export default (config = {}) => ({
  baseUrl,
  method,
  path,
  params
}) => axios({
  method,
  baseURL: baseUrl,
  url: path,
  data: params,
  ...config
})
  .then(({ data }) => data)
