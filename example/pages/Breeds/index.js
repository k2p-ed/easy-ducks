// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Heading from '../../components/Heading'
import Link from '../../components/Link'
import Placeholder from '../../components/Placeholder'

import { fetchBreeds, selectBreeds, selectIfLoading } from '../../ducks/breeds'

type Props = {
  breeds: string[],
  fetchBreeds: () => Promise<Object>,
  loading: boolean
}

export class Breeds extends Component<Props> {
  componentDidMount() {
    this.props.fetchBreeds()
  }

  render() {
    const { breeds, loading } = this.props

    if (loading) return <Placeholder />

    return (
      <div>
        <Heading>Breeds</Heading>
        <p>Choose a breed below to see its sub breeds.</p>
        {breeds.map(breed => (
          <div key={breed}>
            <Link to={`/${breed}`}>{breed}</Link>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  breeds: selectBreeds(state),
  loading: selectIfLoading(state)
})

export default connect(mapStateToProps, { fetchBreeds })(Breeds)
