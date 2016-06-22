import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Card, CardContent, CardTitle, CardActions } from '../Card'
import { Button } from '../Form'
import Media from '../Media/Media'

function Post (props, context) {
  const { post, editPost, t } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })

  return (
    <Card key={post.id}>
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
            label='Edit post'
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
    media: PropTypes.array.isRequired,
    content: PropTypes.string,
    editPost: PropTypes.func
  }).isRequired
}

export default translate(['common'])(Post)
