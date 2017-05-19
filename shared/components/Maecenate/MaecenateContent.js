import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import marked from 'marked'

import style from './MaecenateStyle'
import { Card, CardHeader, CardBigTitle, CardContent } from '../Card'
import Post from '../Post/Post'
import Avatar from 'material-ui/Avatar'
import Media from '../Media/Media'
import cropCloudy from '../../lib/cropCloudy'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

function MaecenateContent (props) {
  const {
    maecenate,
    posts,
    editPost,
    editMaecenate,
    showMaecenateTitle,
    isAuthUserOwner,
    t
  } = props

  const {
    cover,
    description,
    teaser,
    title,
    url
  } = maecenate

  return (
    <div style={style.mainContainer}>
      <Card>
        <CardHeader
          style={style.header}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <div style={style.titleWrap}>
          <Avatar
            src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
            size={Number(style.avatarSize)}
            style={style.avatar}
          />
          <CardBigTitle>
            { title }
          </CardBigTitle>
        </div>
        {isAuthUserOwner &&
          <IconButton
            style={style.editIcon}
            onTouchTap={editMaecenate} >
            <EditIcon />
          </IconButton>
        }
        {maecenate.active ||
          <CardContent style={style.closedMessage}>
            { t('maecenate.closedSupporterMessage') }
          </CardContent>
        }
        <CardContent expandable={true} style={style.cardContainer}>
          <div style={style.line}></div>
          { maecenate.cover &&
            <Media type={cover.type} url={cover.url} fixedRatio={true} />
          }
          <CardContent textLayout={true} style={style.description}>
            <div style={style.subtitle}>
              { teaser }
            </div>
            { description &&
              <div style={style.description} dangerouslySetInnerHTML={{
                __html: marked(description, { sanitize: true })
              }}></div>
            }
            {url &&
              <div style={style.url}>
                {t('website')}:
                <a
                  href={`http://${url}`}
                  target='_blank'
                  style={style.link}>
                  &nbsp;{url}
                </a>
              </div>
            }
          </CardContent>
        </CardContent>
      </Card>
      { posts.map(post => (
        <Post
          post={post}
          maecenate={maecenate}
          editPost={editPost}
          key={post.id}
          showMaecenateTitle={showMaecenateTitle} />
      ))}
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
