import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { Card, CardContent, CardTitle, CardActions, CardHeader } from '../Card'
import { Button } from '../Form'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'

function Post (props, context) {
  const { post, maecenate, editPost, t } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })
  const maecenateUrl = '/maecenate/' + maecenate.slug

  return (
    <Card key={post.id}>
      <Link to={maecenateUrl}>
        <CardHeader
          title={maecenate.title}
          avatar={cropCloudy(maecenate.logo.url, 'logo-tiny')}
        />
      </Link>
      <CardTitle title={post.title} subtitle={writtenByAlias} />
      {media &&
        <Media type={media.type} url={media.url} fixedRatio={false} />
      }
      <CardContent noTopPadding={true}>
        {post.content}
      </CardContent>
      {editPost &&
        <CardActions>
          <Button
            label={t('post.edit')}
            flat={true}
            onClick={editPost.bind(null, post.id)} />
        </CardActions>
      }
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
