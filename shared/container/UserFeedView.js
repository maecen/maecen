import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { getPosts } from '../selectors/post'
import * as Actions from '../actions'

import Post from '../components/Post/Post'

class UserFeedView extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(Actions.fetchUserFeed())
  }

  render () {
    const { posts } = this.props

    return (
      <div>
        {posts.map(post =>
          <Post
            key={post.id}
            post={post}
            maecenate={post.maecenate}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    posts: getPosts(state, props)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(UserFeedView)
)

