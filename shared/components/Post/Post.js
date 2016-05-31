import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import { startsWith } from 'strman'
import { Card, CardContent, CardTitle } from '../Card'

function Post (props, context) {
  const { post, t } = props
  const media = post.media && post.media[0]
  const writtenByAlias = t('post.writtenByAlias', { alias: post.author_alias })

  return (
    <Card key={post.id}>
      <CardTitle title={post.title} subtitle={writtenByAlias} />
      {media && (
        startsWith(media.type, 'video')
          ? <video width='100%' src={media.url} controls />
          : <img src={media.url} width='100%' />
      )}
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
