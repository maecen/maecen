import React, { PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid/lib'
import { translate } from 'react-i18next'

import { Card, CardTitle } from '../Card'
import Post from '../Post/Post'
import s from './MaecenateContent.scss'
import Avatar from 'material-ui/Avatar'
import cropCloudy from '../../lib/cropCloudy'

function MaecenateContent (props) {
  const { maecenate, posts, editPost, noTitleOnPosts } = props

  return (
    <div className={s.wrap}>
      <Row>
        <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
          <Card>
            <Avatar
              src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              size={60}
              style={{
                marginLeft: '16px',
                marginBottom: '-16px',
                marginTop: '16px'
              }}
            />
            <CardTitle big={true} title={maecenate.title} />
          </Card>
          {posts.map(post => (
              <Post
                post={post}
                maecenate={maecenate}
                editPost={editPost}
                key={post.id}
                noTitleOnPosts={noTitleOnPosts} />
          ))}
        </Col>
      </Row>
    </div>
  )
}

MaecenateContent.propTypes = {
  maecenate: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default translate(['common'])(
  MaecenateContent
)
