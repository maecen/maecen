import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import map from 'lodash/map'
import { Row, Cell } from '../components/Grid'
import * as Actions from '../actions'
import { getMaecenates } from '../selectors/maecenate'

import { MaecenateCard } from '../components/Maecenate'

class MaecenateOverviewView extends Component {

  gotoMaecenate (maecenate) {
    browserHistory.push(`/maecenate/${maecenate.slug}`)
  }

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
            <Cell md='1/2' key={maecenate.id}>
              <MaecenateCard
                maecenate={maecenate}
                onClick={this.gotoMaecenate.bind(this, maecenate)} />
            </Cell>
        )}
        {map(maecenates, maecenate =>
          maecenate.id !== aboutMaecenateId &&
            <Cell md='1/2' key={maecenate.id}>
              <MaecenateCard
                maecenate={maecenate}
                onClick={this.gotoMaecenate.bind(this, maecenate)} />
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
