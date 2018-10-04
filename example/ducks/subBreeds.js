// @flow

import { Duck } from '../../src'

const duck = new Duck('subBreeds', {
  baseUrl: 'https://dog.ceo/api'
})

export default duck.reducer

export const fetchSubBreeds = (breed: string) => duck.get(`/breed/${breed}/list`)

// Selectors

const baseSelector = state => state.subBreeds

export const selectSubBreeds = (state: Object) => baseSelector(state).message || []

export const selectIfLoading = (state: Object) => baseSelector(state).loading
