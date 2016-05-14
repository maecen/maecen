import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import map from 'lodash/map'
import HeaderContainer from './HeaderContainer'
import FooterContainer from './FooterContainer'
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
      <div>
        <HeaderContainer />
        <div className='container'>

          {map(maecenates, maecenate =>
            <MaecenateCard
              maecenate={maecenate}
              onClick={this.gotoMaecenate.bind(this, maecenate)}
              key={maecenate._id} />
          )}

        </div>
        <FooterContainer />
      </div>
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
