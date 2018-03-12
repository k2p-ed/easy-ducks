import Duck from '../../src/'

const duck = new Duck('subBreeds', {
  baseUrl: 'https://dog.ceo/api'
})

export default duck.reducer

export const fetchSubBreeds = breed => duck.get(`/breed/${breed}/list`)

// Selectors

const baseSelector = state => state.subBreeds

export const selectSubBreeds = state => baseSelector(state).message || []

export const selectIfLoading = state => baseSelector(state).loading
