import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import * as Actions from '../../actions/actions'

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

function mapStateToProps (store) {
  const { app, entities } = store
  const maecenate = entities.maecenates[app.maecenate] || null
  const posts = app.posts.map(id => entities.posts[id])

  return {
    maecenate,
    posts
  }
}

export default connect(mapStateToProps)(MaecenateContentView)

