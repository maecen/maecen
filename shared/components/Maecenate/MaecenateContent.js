import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'
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
        <div style={style.cardContainer}>
          <div style={style.titleWrap}>
            <Avatar
              src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              size={60}
              style={style.avatar}
            />
            <CardBigTitle>
              { title }
            </CardBigTitle>
          </div>
          <CardHeader
            title="Expand virker ikke lige nu..."
            // style={style.header}
            actAsExpander={true}
            showExpandableButton={true}
          />
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
          <CardContent expandable={true}>
            { maecenate.cover &&
              <Media type={cover.type} url={cover.url} fixedRatio={true} />
            }
          </CardContent>
          <CardContent expandable={true} textLayout={true}>
            <div style={style.subtitle}>
              { teaser }
            </div>
            { description }
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
        </div>
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

const { spacer, font, color, border, defaults } = styleVariables
const style = {
  mainContainer: {
    width: '100%'
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: styleVariables.avatar.radius
  },
  editIcon: {
    marginRight: '0px',
    position: 'absolute',
    top: '0px',
    right: '0px'
  },
  header: {
    position: 'absolute',
    right: '0px',
    top: styleVariables.spacer.onePointFive
  },
  closedMessage: {
    fontWeight: font.weight.subtitle,
    textAlign: 'center'
  },
  subtitle: {
    fontWeight: font.weight.subtitle,
    marginBottom: spacer.base
  },
  url: {
    marginTop: spacer.base
  },
  link: {
    color: color.primary,
    textDecoration: 'none'
  },
  supportWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderTop: `${border.thickness} solid ${color.background}`,
    paddingTop: spacer.double,
    paddingBottom: spacer.base
  },
  button: {
    flexShrink: '0',
    marginLeft: 'auto'
  }
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
