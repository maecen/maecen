// Imports
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import moment from 'moment'

// Utils
import { postStatus } from '../../config'
import styleVariables from '../styleVariables'

// Components
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import { TextLink } from '../Link'
import { Card, CardContent, CardTitle, CardHeader } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'

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
      {showMaecenateTitle === false
        ? null
        : <Link to={`/${maecenate.slug}`}>
            <CardHeader
              title={maecenate.title}
              avatar={cropCloudy(maecenate.logo.url, 'logo-tiny')}
            />
          </Link>
      }
      <CardTitle title={post.title}
        style={{paddingBottom: '0px'}} />
      {editPost &&
        <IconButton
          style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
          onClick={editPost.bind(null, post.id)}>
          <EditIcon />
        </IconButton>
      }
      <CardContent
        noTopPadding={true}
        style={{opacity: '0.6'}}>
        {writtenByAlias}
        <span style={{ float: 'right' }}>
          {moment(post.created_at).fromNow()}
        </span>
      </CardContent>
      {media &&
        <Media type={media.type} url={media.url} fixedRatio={false} />
      }
      <CardContent noTopPadding={true}>
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
    </Card>
  )
}

const style = {
  base: {},
  hidden: {
    opacity: 0.5
  },
  fileDownload: {
    paddingTop: styleVariables.spacer.base
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
