import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'

import { getPosts } from '../selectors/post'
import * as Actions from '../actions'

import Post from '../components/Post/Post'
import SearchIcon from 'material-ui/svg-icons/action/search'

class UserFeedView extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(Actions.fetchUserFeed())
  }

  render () {
    const { posts, t } = this.props

    const feedStyle = {
      padding: '4vw 0 6vw'
    }

    const h1Style = {
      fontSize: '30px',
      color: 'white',
      lineHeight: '1.2',
      fontWeight: '300',
      marginTop: '0px'
    }

    const colStyle = {
      marginBottom: '24px'
    }

    const getStartedStyle = {
      color: 'white',
      lineHeight: '1.6'
    }

    return (
      <div style={feedStyle}>
        <Row>
          <Col md={3} sm={3} xs={12} style={colStyle}>
            <h1 style={h1Style}>{t('feed.yourNews')}</h1>
          </Col>
          <Col sm={8} md={6} xs={12}>
            {posts.length !== 0
              ? posts.map(post =>
                  <Post
                    key={post.id}
                    post={post}
                    maecenate={post.maecenate}
                  />
                )
              : <div>
                  <div style={getStartedStyle}>{t('feed.getStarted')}</div>
                  <Row>
                    <Col xs={2} style={colStyle}>
                      <Link to='/maecenates' style={{marginRight: '5px'}}>
                        <SearchIcon color={'white'} style={{width: '60px', height: '60px', opacity: '0.6'}}/>
                      </Link>
                    </Col>
                    <Col xs={10} style={colStyle}>>
                      <div style={getStartedStyle}>{t('feed.findMaecenate')}</div>
                    </Col>
                  </Row>
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
