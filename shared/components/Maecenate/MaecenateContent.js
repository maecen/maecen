import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'
import { Card, CardHeader, CardBigTitle, CardContent } from '../Card'
import { Row, Cell } from '../Grid'
import Post from '../Post/Post'
import Avatar from 'material-ui/Avatar'
import Media from '../Media/Media'
import cropCloudy from '../../lib/cropCloudy'

function MaecenateContent (props) {
  const { maecenate, posts, editPost, showMaecenateTitle, t } = props

  const style = {
    avatar: {
      margin: styleVariables.spacer.base,
      marginRight: '0px'
    },
    header: {
      position: 'absolute',
      right: '0px',
      top: styleVariables.spacer.onePointFive
    },
    link: {
      color: styleVariables.color.primary,
      textDecoration: 'none'
    },
    subtitle: {
      fontWeight: styleVariables.font.weight.subtitle
    },
    titleWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    closedMessage: {
      fontWeight: styleVariables.font.weight.subtitle,
      textAlign: 'center'
    }
  }

  return (
    <Row>
      <Cell narrowLayout={true}>
        <Card>
          <div style={style.titleWrap}>
            <Avatar
              src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              size={60}
              style={style.avatar}
            />
            <CardBigTitle>
              {maecenate.title}
            </CardBigTitle>
          </div>
          <CardHeader
            style={style.header}
            actAsExpander={true}
            showExpandableButton={true}
          />
          {maecenate.active ||
            <CardContent style={style.closedMessage}>
              { t('maecenate.closedSupporterMessage') }
            </CardContent>
          }

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
          {maecenate.active &&
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
          }
        </Card>
        {posts.map(post => (
          <Post
            post={post}
            maecenate={maecenate}
            editPost={editPost}
            key={post.id}
            showMaecenateTitle={showMaecenateTitle} />
        ))}
      </Cell>
    </Row>
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
