import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import * as Actions from '../../actions/actions'
import { getMaecenateBySlug } from '../../selectors/maecenate.selectors'
import { getPosts } from '../../selectors/post.selectors'

import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import { Card, CardContent, CardTitle } from '../../components/Card'

class MaecenateContentView extends Component {

  constructor (props) {
    super(props)
    this.createPost = this.createPost.bind(this)
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

  render () {
    const { maecenate, posts } = this.props

    return (
      <ContentWrapper>
        {maecenate && posts
          ? <div>
              <h2>{maecenate.title}</h2>
              {posts.map(post => (
                <Card key={post.id}>
                  <CardTitle title={post.title} />
                  <CardContent>
                    {post.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          : <div>Loading...</div>
        }
      </ContentWrapper>
    )
  }
}

MaecenateContentView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}, (params) => {
  return Actions.fetchMaecenatePosts(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    maecenate: getMaecenateBySlug(state, props),
    posts: getPosts(state, props)
  }
}

export default connect(mapStateToProps)(MaecenateContentView)

