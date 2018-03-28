// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { type Match } from 'react-router-dom'
import styled from 'styled-components'

import Heading from '../../components/Heading'
import Link from '../../components/Link'
import Placeholder from '../../components/Placeholder'

import { fetchSubBreeds, selectSubBreeds, selectIfLoading } from '../../ducks/subBreeds'

const SubBreedList = styled.div`
  margin-bottom: 2rem;
`

type Props = {
  fetchSubBreeds: typeof fetchSubBreeds,
  loading: boolean,
  match: Match,
  subBreeds: string[]
}

class SubBreeds extends Component<Props> {
  componentDidMount() {
    this.props.fetchSubBreeds(this.props.match.params.breed)
  }

  render() {
    const { subBreeds, loading } = this.props

    if (loading) return <Placeholder />

    return (
      <div>
        <Heading>{this.props.match.params.breed}</Heading>
        <SubBreedList>
          {subBreeds.length
            ? subBreeds.map(breed => <div key={breed}>{breed}</div>)
            : <span>No sub breeds found.</span>
          }
        </SubBreedList>
        <Link to='/'>Back to breeds</Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  subBreeds: selectSubBreeds(state),
  loading: selectIfLoading(state)
})

export default connect(mapStateToProps, { fetchSubBreeds })(SubBreeds)
