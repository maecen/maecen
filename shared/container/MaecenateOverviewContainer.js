import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import map from 'lodash/map'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

class MaecenateOverviewContainer extends Component {

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
          <div key={maecenate._id}>
            <Link to={`/maecenate/${maecenate.slug}`}>
              {maecenate.title}
            </Link>
          </div>
        )}

        </div>
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
