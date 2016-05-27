import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import * as Actions from '../../actions/actions'
import { getMaecenateBySlug } from '../../selectors/maecenate.selectors'
import { getPosts } from '../../selectors/post.selectors'

import { Card, CardTitle } from '../../components/Card'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import Button from '../../components/Form/Button'
import Post from '../../components/Post/Post'

class MaecenateContentView extends Component {

  constructor (props) {
    super(props)
    this.createPost = this.createPost.bind(this)
    this.gotoMaecenate = this.gotoMaecenate.bind(this)
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

  gotoMaecenate () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}`)
  }

  render () {
    const { maecenate, posts, t } = this.props

    return (
      <ContentWrapper>
        {maecenate && posts
          ? <div>
              <Card>
                <CardTitle big={true} title={maecenate.title} />
              </Card>
              {posts.map(post => (
                <Post post={post} />
              ))}
            </div>
          : <div>Loading...</div>
        }
        <Button primary={true} label={t('backTo') + maecenate.title} onClick={this.gotoMaecenate} />
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

export default translate(['common'])(
 connect(mapStateToProps)(MaecenateContentView)
)
