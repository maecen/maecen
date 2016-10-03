import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import {
  getMaecenateBySlug,
  isAuthUserMaecenateOwner
} from '../selectors/maecenate'
import { isAuthUserMaecenateSupporter } from '../selectors/support'
import { getPosts } from '../selectors/post'
import * as Actions from '../actions'

import {
  MaecenatePresentation,
  MaecenateContent
} from '../components/Maecenate'

class MaecenateView extends Component {
  constructor (props) {
    super(props)

    this.editPost = this.editPost.bind(this)
    this.supportMaecenate = this.supportMaecenate.bind(this)
    this.editMaecenate = this.editMaecenate.bind(this)
    this.state = {
      maecenateSupportOpen: false
    }
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
  }

  supportMaecenate () {
    const { slug } = this.props.params

    this.props.requireAuth(`/${slug}/support`)
  }

  editMaecenate () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/edit`)
  }

  editPost (postId) {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/post/${postId}/edit`)
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
    const forcePresentation = Boolean(this.props.route.presentation)
    const noTitleOnPosts = Boolean(this.props.route.noTitleOnPosts)

    if (!forcePresentation && (isAuthUserOwner || isSupporter)) {
      return <MaecenateContent
        maecenate={maecenate}
        noTitleOnPosts={noTitleOnPosts}
        posts={posts}
        editPost={isAuthUserOwner && this.editPost}
        isAuthUserOwner={isAuthUserOwner}
      />
    } else {
      return <MaecenatePresentation
        maecenate={maecenate}
        supportMaecenate={this.supportMaecenate}
        editMaecenate={this.editMaecenate}
        isAuthUserOwner={isAuthUserOwner}
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

export default connect(mapStateToProps, {
  requireAuth: Actions.requireAuth
})(MaecenateView)
