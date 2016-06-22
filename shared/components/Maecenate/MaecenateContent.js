import React, { PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid/lib'
import { translate } from 'react-i18next'

import { Card, CardTitle } from '../Card'
import Post from '../Post/Post'
import s from './MaecenateContent.scss'
import Avatar from 'material-ui/Avatar'
import cropCloudy from '../../lib/cropCloudy'

function MaecenateContent (props) {
  const { maecenate, posts } = props

  return (
    <div className={s.wrap}>
      <Row>
        <Col smOffset={2} sm={8} mdOffset={3} md={6} xs={12}>
          <Card>
            <Avatar
              src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              size={60}
              style={{
                marginLeft: '16px',
                marginBottom: '-16px'
              }}
            />
            <CardTitle big={true} title={maecenate.title} />
          </Card>
          {posts.map(post => (
            <Post post={post} key={post.id} />
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
