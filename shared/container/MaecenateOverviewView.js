// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import map from 'lodash/map'

// Actions & Selectors
import * as Actions from '../actions'
import { getMaecenates } from '../selectors/maecenate'

// Components
import Link from '../components/Link'
import { Row, Cell } from '../components/Grid'
import { MaecenateCard } from '../components/Maecenate'

class MaecenateOverviewView extends Component {

  componentDidMount () {
    const {dispatch, params} = this.props
    dispatch(this.constructor.need[0](params))
  }

  render () {
    const { maecenates } = this.props
    const aboutMaecenateId = '78892b00-33a3-11e6-bb94-c586d1c98fee'
    return (
      <Row>
        {/* TODO this could prolly be done smarter ¯\_(ツ)_/¯, sort()? */}
        {map(maecenates, maecenate =>
          maecenate.id === aboutMaecenateId &&
            <Cell md={6} key={maecenate.id}>
              <Link to={`/${maecenate.slug}`}>
                <MaecenateCard maecenate={maecenate} />
              </Link>
            </Cell>
        )}
        {map(maecenates, maecenate =>
          maecenate.id !== aboutMaecenateId &&
            <Cell md={6} key={maecenate.id}>
              <Link to={`/${maecenate.slug}`}>
                <MaecenateCard maecenate={maecenate} />
              </Link>
            </Cell>
        )}
      </Row>
    )
  }
}

MaecenateOverviewView.need = [(params) => {
  return Actions.fetchMaecenateList(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    maecenates: getMaecenates(state, props)
  }
}

export default connect(mapStateToProps)(MaecenateOverviewView)
