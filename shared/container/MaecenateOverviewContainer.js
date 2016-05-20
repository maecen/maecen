import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import map from 'lodash/map'
import { Row, Col } from 'react-flexbox-grid/lib'
import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import * as Actions from '../actions/actions'

import MaecenateCard from '../components/Maecenate/MaecenateCard'

class MaecenateOverviewContainer extends Component {

  gotoMaecenate (maecenate) {
    browserHistory.push(`/maecenate/${maecenate.slug}`)
  }

  componentDidMount () {
    const {dispatch, params} = this.props
    dispatch(this.constructor.need[0](params))
  }

  render () {
    const { maecenates } = this.props

    return (
      <ContentWrapper>
        <Row>
          {map(maecenates, maecenate =>
            <Col sm={6} xs={12} key={maecenate.id}>
              <MaecenateCard
                maecenate={maecenate}
                onClick={this.gotoMaecenate.bind(this, maecenate)} />
            </Col>
          )}
        </Row>
      </ContentWrapper>
    )
  }
}

MaecenateOverviewContainer.need = [(params) => {
  return Actions.fetchMaecenateList(params.slug)
}]

function mapStateToProps (store) {
  const { app, entities } = store
  const maecenates = map(app.maecenates, (id) => entities.maecenates[id])

  return {
    maecenates
  }
}

export default connect(mapStateToProps)(MaecenateOverviewContainer)
