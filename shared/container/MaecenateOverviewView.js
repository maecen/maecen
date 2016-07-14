import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import map from 'lodash/map'
import { Row, Col } from 'react-flexbox-grid/lib'
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
        {map(maecenates, maecenate =>
          maecenate.id === aboutMaecenateId &&
            <Col sm={6} xs={12} key={maecenate.id}>
              <MaecenateCard
                maecenate={maecenate}
                onClick={this.gotoMaecenate.bind(this, maecenate)} />
            </Col>
        )}
        {map(maecenates, maecenate =>
          maecenate.id !== aboutMaecenateId &&
            <Col sm={6} xs={12} key={maecenate.id}>
              <MaecenateCard
                maecenate={maecenate}
                onClick={this.gotoMaecenate.bind(this, maecenate)} />
            </Col>
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
