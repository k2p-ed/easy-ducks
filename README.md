# Easy Ducks

[![travis build](https://img.shields.io/travis/k2p-ed/easy-ducks.svg?style=flat-square)](https://travis-ci.org/k2p-ed/easy-ducks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Easy Ducks is a utility that simplifies the implementation of the [ducks pattern](https://github.com/erikras/ducks-modular-redux) for async actions in Redux. It eliminates the need to manually create reducers (no more switch statements!) or action types, and greatly simplifies action creators.

Easy Ducks automatically handles loading states by adding `loading` and `didLoad` keys to each reducer. When a request is in progress, `loading` will be true, and when a request has previously completed at some point, `didLoad` is set to true. This can be useful if you want to show a different loading state for when there is some pre-existing data, versus the initial load with no data.

By default, Easy Ducks adds async responses to the reducer by with object spread notation, e.g.,

```js
(state, action) => ({ ...state, ...action.response })
```

You can override this by providing `resolver` functions to action creators in order to define custom behavior.

Easy Ducks assumes you're using [redux-thunk](https://github.com/gaearon/redux-thunk) middleware in your project.

The default configuration relies on the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), so you may need to provide a polyfill for extended browser support. Alternatively, you can use plugins to support other http implementations.

## Installation

```sh
yarn add easy-ducks

# or

npm install --save easy-ducks
```

## Quick Start

First create your duck and export the reducer:

```js
// ducks/users.js

import Duck from 'easy-ducks'

const duck = new Duck('myDuck', {
  baseUrl: 'https://myapi.com/api'
})

// Pass this to redux's combineReducers function
export default duck.reducer

// Action creators
export const getUser = id => duck.get(`/users/${id}`)

export const createUser = (params = {}) => duck.post('/users', { params })

export const editUser = (id, params = {}) => duck.put(`/users/${id}`, { params })

export const deleteUser = id => duck.delete(`/users/:id`)
```

Then add the exported `duck.reducer` to your root reducer:

```js
// ducks/index.js

import { combineReducers } from 'redux'

import users from './users'

export default combineReducers({ users })
```

## Options

### Instance Options

The first constructor argument is a string indicating the name of the duck. The name is used to assemble the Redux action type, so it **must** be unique.

The format for the generated action types looks like this:

`[{name}] {method}: {status}`

For example, if you create a duck with the name `myDuck`, the actions for `duck.get()` would look like this:

```js
// GET begin
{ type: '[myDuck] GET: BEGIN' }

// GET error
{ type: '[myDuck] GET: ERROR', error }

// GET success
{ type: '[myDuck] GET: SUCCESS', response }
```

The second constructor argument is an instance configuration object:

| Name         | Type     | Required | Default | Description |
|--------------|----------|----------|---------|---------|
| baseUrl      | string   | true     |         | The base url for your api |
| initialState | object   | false    |         | The default value to be passed to the reducer |
| plugin       | function | false    |         | Allows for http implementations other than `fetch` |
| storeParams  | boolean  | false    | false   | Tells Easy Ducks to save any params passed to a request in the reducer |

As an alternative to `storeParams`, you can include a `params` object in the `initialState`:

```js
const duck = new Duck('myDuck', {
  baseUrl: 'https://myapi.com/api',
  initialState: {
    params: {}
  }
})
```

### Request Options

The first request argument is `path`, which is a string that indicates the remainder of the request URL after the `baseUrl` provided in the constructor.

The second request argument is an optional configuration object:

| Name         | Type     | Required | Description | Arguments |
|--------------|----------|----------|-------------|-----------|
| actionModifiers | object | false | Allows for modifying the dispatched action. | |
| onError     | function | false | Callback function for request error | `error`, &nbsp;`getState` |
| onSuccess   | function | false | Callback function for request success | `success`, &nbsp;`getState`
| params      | object   | false     | Contains any parameters to be passed with the request. | |
| resolver | function   | false    | Allows custom handling of responses | `state`, &nbsp;`action` | |
| verb       | string | false    | Specifies an alternate verb to use in the action type. Defaults to the http method, e.g. `get`, `post`, etc. | |


### Global configuration

This package provides a named export called `DuckFactory` to simplify re-use of configuration values across all duck instances.

```js
// duckFactory.js

import { DuckFactory } from 'easy-ducks'

import plugin from 'utils/myPlugin'

const duckFactory = new DuckFactory({
  baseUrl: 'https://my-api.com/api',
  plugin
})

export default duckFactory
```

Now import this instance into your individual duck files and create new ducks from that. Ducks created using this method will inherit any configuration options that you previously specified.

```js
import duckFactory from '../duckFactory'

const duck = duckFactory.create('users')

export default duck.reducer

export const getUsers = () => duck.get('/users')
```

## Action Modifiers

Action modifiers are functions that allow you to modify the object that is passed to the `dispatch` function. You can provide a modifier for each of the three statuses: `begin`, `success`, and `error`.

| Modifier | Arguments |
|-----|-----------|
| begin | `getState` |
| success | `response`, &nbsp;`getState` |
| error | `error`, &nbsp;`getState` |

This functionality can be useful if you're using some type of redux analytics middleware, such as [redux-segment](https://github.com/rangle/redux-segment) to track events based on redux actions.

In this example, the `analytics` key would be added to the object passed to `dispatch`:
```js
const fetchUser = id => duck.get(`/users/${id}`, {
  actionModifiers: {
    success: (response) => ({
      meta: trackEvent('viewed user', { id, name: response.name })
    })
  }
})
```

### Callbacks

The dispatch function returns a promise, so if you want to perform actions after the request's success or failure you can do so inside a `.then` block.

For example, if you wanted to save a response to local storage on success:

```js
import localStorage from 'store'

store.dispatch(fetchUser(1))
  .then((response) => {
    localStorage.set('user', response)
  })
```

Sometimes you may want to perform some action inside the action creator itself. For this scenario there are two optional callbacks, `onSuccess` and `onError`. These callbacks receive `response` and `error`, respectively, as arguments.

Using these callbacks, the example above would look like this:

```js
export const fetchUser = id => duck.get(`/users/${id}`, {
  onSuccess: (response) => {
    localStorage.set('user', response)
  }
})
```

### Resolvers

Resolvers are functions that allow you to define custom behavior for updating the store. Resolvers take the same arguments as the reducer itself, `state` and `action`, and return the new state on request success.

For example, if a reducer contains an array of users, and you want to add the new user object returned by your `createUser` action creator, you can define a resolver that adds it to the end of the array.

```js
export const createUser = (params = {}) => duck.post('/something', {
  params,
  resolver: (state, action) => ({ ...state, users: [...state.users, action.response.user] })
})
```

### Plugins

Easy Ducks uses `fetch` by default to make http requests, but you can provide plugins if you'd like to use something else. Plugins for `axios` and `fetch` are included with the library.

```js
import axiosPlugin from 'easy-ducks/lib/plugins/axios'

const plugin = axiosPlugin()

const duck = new Duck('myDuck', {
  baseUrl: 'https://myapi.com/api',
  plugin
})
```

You can also provide a configuration object to plugin which will be passed along to the config options for the http solution.

```js
const plugin = axiosPlugin({
  headers: {
    Authentication: 'my-auth-token'
  }
})
```

Since `fetch` is used by default, you only need to explicitly provide the `fetch` plugin if you want to pass it a custom configuration object.

Notes:
- If you're using the `axios` plugin, you must have `axios` installed as a package dependency.
- If you're using `fetch`, query params must be included directly in the `path` string.

#### Writing Plugins

Plugins are simply functions that take an object and map the values to the http library of your choice. The object keys are:

- `baseUrl` - The base URL of your API
- `method` - e.g., `delete`, `get`, `post`, `put`
- `path` - The remainder of the request endpoint after `baseUrl`
- `params` - An object containing request data

Take a look at the plugins in the `src/plugins` directory for some examples.

## Example Project

This repo includes an example project that you can run to test out the library in action.

```sh
# Install dependencies
yarn

# Start the dev server
yarn start
```

Then go to `localhost:7000` to view the example project.
