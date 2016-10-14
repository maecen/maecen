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
        <CardHeader
          style={style.header}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <div style={style.titleWrap}>
          <Avatar
            src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
            size={Number(avatar.size)}
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

const { spacer, font, color, border, defaults, avatar } = styleVariables
const style = {
  mainContainer: {
    width: '100%'
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent,
    boxSizing: 'border-box'
  },
  description: {
    padding: `${spacer.base} 0px`
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent,
    padding: `${spacer.double} ${spacer.base} ${spacer.base}`,
    boxSizing: 'border-box'
  },
  line: {
    borderBottom: `${styleVariables.border.thickness} solid ${styleVariables.color.background}`,
    marginBottom: spacer.base,
    transform: `translate(0, -${spacer.base})`
  },
  avatar: {
    borderRadius: avatar.radius,
    marginRight: spacer.base
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
    top: spacer.double
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
