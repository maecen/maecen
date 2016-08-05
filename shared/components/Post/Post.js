import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import Time from 'react-time'

import { Card, CardContent, CardTitle, CardHeader } from '../Card'
import IconButton from 'material-ui/IconButton'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

function Post (props, context) {
  const { post, maecenate, editPost, t, noTitleOnPosts } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })
  const maecenateUrl = '/maecenate/' + maecenate.slug

  return (
    <Card key={post.id}>
      {noTitleOnPosts ||
        <Link to={maecenateUrl}>
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
        <Time style={{float: 'right'}} value={post.created_at} format='DD/MM/YYYY' />
      </CardContent>
      {media &&
        <Media type={media.type} url={media.url} fixedRatio={false} />
      }
      <CardContent noTopPadding={true}>
        {post.content}
      </CardContent>
    </Card>
  )
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
  }).isRequired
}

export default translate(['common'])(Post)
