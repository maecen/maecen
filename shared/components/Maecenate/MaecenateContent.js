import React, { PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid/lib'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'
import { Card, CardTitle, CardContent } from '../Card'
import Post from '../Post/Post'
import Avatar from 'material-ui/Avatar'
import Media from '../Media/Media'
import cropCloudy from '../../lib/cropCloudy'

function MaecenateContent (props) {
  const { maecenate, posts, editPost, noTitleOnPosts, t } = props

  const style = {
    avatar: {
      marginLeft: styleVariables.spacer.base,
      marginBottom: `-${styleVariables.spacer.base}`,
      marginTop: styleVariables.spacer.base
    },
    header: {
      position: 'absolute',
      right: '0px',
      top: styleVariables.spacer.double
    },
    wrap: {
      padding: styleVariables.layout.wrap
    },
    link: {
      color: styleVariables.color.primary,
      textDecoration: 'none'
    },
    subtitle: {
      fontWeight: styleVariables.font.weight.subtitle
    }
  }

  return (
    <div style={style.wrap}>
      <Row>
        <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
          <Card>
            <CardHeader
              style={style.header}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <Avatar
              src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              size={60}
              style={style.avatar}
            />
            <CardTitle big={true} title={maecenate.title} />
            <CardContent expandable={true}>
              { maecenate.cover &&
                <Media type={maecenate.cover.type} url={maecenate.cover.url} fixedRatio={true} />
              }
            </CardContent>
            <CardContent style={style.subtitle} expandable={true}>
              { maecenate.teaser }
            </CardContent>
            <CardContent expandable={true}>
              { maecenate.description }
            </CardContent>
            <CardContent expandable={true}>
              {t('support.minimumAmount',
                { context: 'DKK', count: maecenate.monthly_minimum })}
              <br />
              {maecenate.url &&
                <span>
                  {t('website')}:
                  <a
                    href={`http://${maecenate.url}`}
                    target='_blank'
                    style={style.link}>
                    &nbsp;{maecenate.url}
                  </a>
                </span>
              }
            </CardContent>
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
