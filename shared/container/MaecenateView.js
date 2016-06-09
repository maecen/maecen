import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import {
  getMaecenateBySlug,
  isAuthUserMaecenateOwner
} from '../selectors/Maecenate.selectors'
import * as Actions from '../actions/actions'

import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import MaecenatePresentation from '../components/Maecenate/MaecenatePresentation'

class MaecenateView extends Component {

  constructor (props) {
    super(props)
    this.createPost = this.createPost.bind(this)
    this.gotoContent = this.gotoContent.bind(this)
    this.supportMaecenate = this.supportMaecenate.bind(this)

    this.state = {
      maecenateSupportOpen: false
    }
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  createPost () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/new-post`)
  }

  gotoContent () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/content`)
  }

  supportMaecenate () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/support`)
  }

  render () {
    const { maecenate, isAuthUserOwner } = this.props

    return (
      <ContentWrapper>
        {maecenate
          ? <div>
              <MaecenatePresentation
                maecenate={maecenate}
                isAuthUserOwner={isAuthUserOwner}
                createPost={this.createPost}
                gotoContent={this.gotoContent}
                supportMaecenate={this.supportMaecenate}
              />
            </div>
          : <div>Loading...</div>
        }
      </ContentWrapper>
    )
  }
}

MaecenateView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    maecenate: getMaecenateBySlug(state, props),
    isAuthUserOwner: isAuthUserMaecenateOwner(state, props)
  }
}

export default connect(mapStateToProps)(MaecenateView)
