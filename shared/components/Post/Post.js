// Imports
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import moment from 'moment'

// Utils
import { postStatus } from '../../config'
import cropCloudy from '../../lib/cropCloudy'
import styleVariables from '../styleVariables'

// Components
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import { TextLink } from '../Link'
import { Card, CardContent, CardBigTitle, CardTitle } from '../Card'
import Media from '../Media/Media'
import Avatar from 'material-ui/Avatar'

function Post (props, context) {
  const { post, maecenate, editPost, t, showMaecenateTitle } = props
  const media = post.media && post.media[0]
  const file = post.file
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })

  const baseStyle = Object.assign({}, style.base,
    post.status === postStatus.HIDDEN ? style.hidden : null
  )

  return (
    <Card style={baseStyle}>
      <div style={style.cardContainer}>
        {showMaecenateTitle === false
          ? <div style={style.extraSpace}></div>
          : <Link to={`/${maecenate.slug}`} style={style.link}>
              <Avatar
                src={cropCloudy(maecenate.logo.url, 'logo-tiny')}
                style={style.avatar}
                size={styleVariables.avatar.size}
              />
              <CardTitle style={style.maecenateTitle}>{ maecenate.title }</CardTitle>
            </Link>
        }
        <CardBigTitle style={style.postTitle}>
          { post.title }
        </CardBigTitle>
        {editPost &&
          <IconButton
            style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
            onClick={editPost.bind(null, post.id)}>
            <EditIcon />
          </IconButton>
        }
        {media &&
          <Media type={media.type} url={media.url} fixedRatio={false} />
        }
        <CardContent noTopPadding={true} textLayout={true}>
          {post.content}

          {file &&
            <div style={style.fileDownload}>
              {t('post.downloadAttachment')}
              &nbsp;
              <TextLink to={file.url} rel='external'>
                {file.filename}
              </TextLink>
            </div>
          }
        </CardContent>
        <CardContent noTopPadding={true}>
          <div style={style.metaData}>
            {writtenByAlias}
            <span style={{ float: 'right' }}>
              {moment(post.created_at).fromNow()}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

const { spacer, border } = styleVariables

const style = {
  extraSpace: {
    height: spacer.base
  },
  link: {
    padding: `${spacer.base} 0px`,
    margin: `0px ${spacer.base}`,
    display: 'flex',
    alignItems: 'center',
    borderBottom: `${border.thickness} solid ${styleVariables.color.background}`
  },
  avatar: {
    borderRadius: styleVariables.avatar.radius
  },
  maecenateTitle: {
    padding: `0px ${spacer.base}`
  },
  base: {},
  hidden: {
    opacity: 0.5
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: styleVariables.defaults.maxWidthContent
  },
  postTitle: {
    borderBottom: 'none',
    padding: `${spacer.base} 0px 0px`,
    margin: `0px ${spacer.base}`,
    textAlign: 'left'
  },
  metaData: {
    opacity: '0.6',
    fontWeight: '300',
    paddingTop: spacer.base,
    borderTop: `${border.thickness} solid ${styleVariables.color.background}`
  },
  fileDownload: {
    paddingTop: spacer.base
  }
}

Post.defaultProps = {
  showMaecenateTitle: true
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author_alias: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    content: PropTypes.string,
    editPost: PropTypes.func
  }).isRequired,
  maecenate: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  showMaecenateTitle: PropTypes.bool
}

export default translate(['common'])(Post)
