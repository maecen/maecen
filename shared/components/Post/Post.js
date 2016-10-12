// Imports
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import moment from 'moment'

// Utils
import { postStatus } from '../../config'

// Components
import styleVariables from '../styleVariables'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import { Card, CardContent, CardBigTitle, CardHeader } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'

function Post (props, context) {
  const { post, maecenate, editPost, t, showMaecenateTitle } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })

  const baseStyle = Object.assign({}, style.base,
    post.status === postStatus.HIDDEN ? style.hidden : null
  )

  return (
    <Card style={baseStyle}>
      <div style={style.cardContainer}>
        {showMaecenateTitle === false
          ? null
          : <Link to={`/${maecenate.slug}`}>
              <CardHeader
                title={maecenate.title}
                avatar={cropCloudy(maecenate.logo.url, 'logo-tiny')}
              />
            </Link>
        }
        <CardBigTitle>
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
          <CardContent>
            <Media type={media.type} url={media.url} fixedRatio={false} />
          </CardContent>
        }
        <CardContent noTopPadding={true} textLayout={true}>
          {post.content}
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

const style = {
  base: {},
  hidden: {
    opacity: 0.5
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: styleVariables.defaults.maxWidthContent
  },
  metaData: {
    opacity: '0.6',
    paddingTop: styleVariables.spacer.base,
    borderTop: `${styleVariables.border.thickness} solid ${styleVariables.color.background}`
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
