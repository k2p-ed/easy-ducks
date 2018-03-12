import axios from 'axios'

export default ({ baseUrl, method, path, params }) => axios({
  method,
  baseURL: baseUrl,
  url: path,
  data: params
})
  .then(({ data }) => data)
