import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Card, CardContent, CardTitle } from '../Card'
import Media from '../Media/Media'

function Post (props, context) {
  const { post, t } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })

  return (
    <Card key={post.id}>
      <CardTitle title={post.title} subtitle={writtenByAlias} />
      {media &&
        <Media type={media.type} url={media.url} fixAspect={false} />
      }
      <CardContent>
        {post.content}
      </CardContent>
    </Card>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}

export default translate(['common'])(Post)
