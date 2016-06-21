import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import {
  getMaecenateBySlug,
  isAuthUserMaecenateOwner
} from '../selectors/Maecenate.selectors'
import {
  isAuthUserMaecenateSupporter
} from '../selectors/Support.selectors'
import {
  getPosts
} from '../selectors/Post.selectors'
import * as Actions from '../actions/actions'

import MaecenatePresentation from '../components/Maecenate/MaecenatePresentation'
import MaecenateContent from '../components/Maecenate/MaecenateContent'

class MaecenateView extends Component {
  constructor (props) {
    super(props)
    this.createPost = this.createPost.bind(this)
    this.supportMaecenate = this.supportMaecenate.bind(this)

    this.state = {
      maecenateSupportOpen: false
    }
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
  }

  createPost () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/new-post`)
  }

  supportMaecenate () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/support`)
  }

  render () {
    const { maecenate } = this.props

    return (maecenate
      ? this.renderContent()
      : <div>Loading...</div>
    )
  }

  renderContent () {
    const { maecenate, posts, isAuthUserOwner, isSupporter } = this.props
    if (isAuthUserOwner || isSupporter) {
      return <MaecenateContent
        maecenate={maecenate}
        posts={posts}
      />
    } else {
      return <MaecenatePresentation
        maecenate={maecenate}
        supportMaecenate={this.supportMaecenate}
      />
    }
  }
}

MaecenateView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}, (params) => {
  return Actions.fetchMaecenatePosts(params.slug)
}]

function mapStateToProps (state, props) {
  const isMaecenateOwner = isAuthUserMaecenateOwner(getMaecenateBySlug)
  const isSupporter = isAuthUserMaecenateSupporter(getMaecenateBySlug)

  return {
    maecenate: getMaecenateBySlug(state, props),
    isAuthUserOwner: isMaecenateOwner(state, props),
    isSupporter: isSupporter(state, props),
    posts: getPosts(state, props)
  }
}

export default connect(mapStateToProps)(MaecenateView)
