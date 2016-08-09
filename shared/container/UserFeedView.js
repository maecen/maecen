import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'

import { getPosts } from '../selectors/post'
import * as Actions from '../actions'

import Button from '../components/Form/Button'
import Post from '../components/Post/Post'
import styleVariables from '../components/styleVariables'
import SearchIcon from 'material-ui/svg-icons/action/search'

class UserFeedView extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(Actions.fetchUserFeed())
  }

  gotoAllMaecenates () {
    browserHistory.push('/maecenates')
  }

  render () {
    const { posts, t } = this.props

    const style = {
      wrap: {
        padding: styleVariables.layout.wrap
      },
      h1: {
        fontSize: styleVariables.font.size.h1,
        color: styleVariables.color.bodyText,
        lineHeight: '1.2',
        fontWeight: '300',
        marginTop: '0px'
      },
      getStarted: {
        color: styleVariables.color.bodyText,
        lineHeight: styleVariables.font.lineHeight.body,
        marginBottom: styleVariables.spacer.base,
        verticalAlign: 'middle'
      },
      findMaecenate: {
        color: styleVariables.color.bodyText,
        lineHeight: styleVariables.font.lineHeight.body,
        verticalAlign: 'top',
        marginTop: styleVariables.spacer.base,
        display: 'inline-block'
      },
      icon: {
        width: styleVariables.icon.size.xl,
        height: styleVariables.icon.size.xl
      }
    }

    return (
      <div style={style.wrap}>
        <Row>
          <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
            <h1 style={style.h1}>{t('feed.yourNews')}</h1>
            { posts.length !== 0
              ? posts.map(post =>
                  <Post
                    key={post.id}
                    post={post}
                    maecenate={post.maecenate}
                  />
                )
              : <div>
                  <div style={style.getStarted}>{t('feed.getStarted')}</div>
                  <Button
                    label={t('feed.findMaecenate')}
                    primary={true}
                    onTouchTap={this.gotoAllMaecenates}
                    icon={<SearchIcon />}
                  />
                </div>
              }
          </Col>
        </Row>
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
