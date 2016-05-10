import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

class MaecenateContainer extends Component {

  componentDidMount () {
    const { dispatch, params } = this.props

    dispatch(this.constructor.need[0](params))
  }

  render () {
    const { maecenate } = this.props

    return (
      <div>
        <HeaderContainer />
        <div className='container'>

        {maecenate
          ? <div>
              <h2>{maecenate.title}</h2>
              <img src={maecenate.logoUrl} />
              <div>{maecenate.teaser}</div>
              <div>{maecenate.description}</div>
              <img src={maecenate.coverUrl} />
            </div>
          : <div>Loading...</div>
        }
        </div>
      </div>
    )
  }
}

MaecenateContainer.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (store) {
  const { app, entities } = store
  const maecenate = entities.maecenates[app.maecenate] || null

  return { maecenate }
}

export default connect(mapStateToProps)(MaecenateContainer)
