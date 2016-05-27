import React, { PropTypes } from 'react'
import { Card, CardContent, CardTitle } from '../Card'

function Post (props, context) {
  const { post } = props

  return (
    <Card key={post.id}>
      <CardTitle title={post.title} />
      <CardContent>
        {post.content}
      </CardContent>
    </Card>
  )
}

export default Post

Post.propTypes = {
  post: PropTypes.object.isRequired
}
