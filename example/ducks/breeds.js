// @flow

import duckFactory from '../duckFactory'

const duck = duckFactory.create('breeds')

export default duck.reducer

export const fetchBreeds = () => duck.get('/breeds/list')

// Selectors

const baseSelector = state => state.breeds

export const selectBreeds = (state: Object) => baseSelector(state).message || []

export const selectIfLoading = (state: Object) => baseSelector(state).loading
