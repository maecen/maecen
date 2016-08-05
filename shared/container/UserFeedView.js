import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'

import { getPosts } from '../selectors/post'
import * as Actions from '../actions'

import Post from '../components/Post/Post'
import styleVariables from '../components/styleVariables'
import SearchIcon from 'material-ui/svg-icons/action/search'

class UserFeedView extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(Actions.fetchUserFeed())
  }

  render () {
    const { posts, t } = this.props

    const feedStyle = {
      padding: '0 0 6vw'
    }

    const h1Style = {
      fontSize: '30px',
      color: styleVariables.color.bodyText,
      lineHeight: '1.2',
      fontWeight: '300',
      marginTop: '0px'
    }

    const getStartedStyle = {
      color: styleVariables.color.bodyText,
      lineHeight: styleVariables.layout.lineHeight,
      verticalAlign: 'middle'
    }

    const findMaecenateStyle = {
      color: styleVariables.color.bodyText,
      lineHeight: styleVariables.layout.lineHeight,
      verticalAlign: 'top',
      marginTop: '15px',
      display: 'inline-block'
    }

    return (
      <div style={feedStyle}>
        <Row>
          <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
            <h1 style={h1Style}>{t('feed.yourNews')}</h1>
            { posts.length !== 0
              ? posts.map(post =>
                  <Post
                    key={post.id}
                    post={post}
                    maecenate={post.maecenate}
                  />
                )
              : <div>
                  <div style={getStartedStyle}>{t('feed.getStarted')}</div>
                  <div>
                    <Link to='/maecenates' style={{marginRight: '5px'}}>
                      <SearchIcon color={'white'} style={{width: '60px', height: '60px', opacity: '0.6'}}/>
                    </Link>
                    <span style={findMaecenateStyle}>{t('feed.findMaecenate')}</span>
                  </div>
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
