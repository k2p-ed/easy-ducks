import Duck from '../../src/'

const duck = new Duck('breeds', {
  baseUrl: 'https://dog.ceo/api'
})

export default duck.reducer

export const fetchBreeds = () => duck.get('/breeds/list')

// Selectors

const baseSelector = state => state.breeds

export const selectBreeds = state => baseSelector(state).message || []

export const selectIfLoading = state => baseSelector(state).loading
