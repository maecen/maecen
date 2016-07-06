import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import Immutable from 'seamless-immutable'

import * as PostActions from '../../actions/post'
import { mediaUpload } from '../../lib/fileHandler'

import { getPostById } from '../../selectors/post'
import { getMaecenateByPost } from '../../selectors/maecenate'

import PostForm from '../../components/Post/PostForm'

class EditPostView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      post: null,
      errors: null,
      isSubmitting: false,
      mediaPreview: null,
      uploadProgress: 0,
      media: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateModel = this.updateModel.bind(this)
    this.mediaChange = this.mediaChange.bind(this)
  }

  componentWillMount () {
    this.setState({ post: Immutable(this.props.post) || null })
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.post === null && this.state.post !== nextProps.post) {
      this.setState({ post: nextProps.post })
    }
  }

  updateModel (path, value) {
    this.setState({ post: this.state.post.setIn(path, value) })
  }

  mediaChange (files) {
    this.setState({ media: files })
    mediaUpload(files, {
      setState: this.setState.bind(this)
    }).then((data) => {
      this.updateModel(['media'], data.result)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, maecenate } = this.props
    const { post } = this.state

    this.setState({ isSubmitting: true })
    axios.put('/api/editPost', { post })
      .then(res => res.data)
      .then(data => {
        this.setState({ errors: null, isSubmitting: false })
        dispatch(PostActions.editPostSuccess(data))
        browserHistory.push(`/maecenate/${maecenate.slug}`)
      }).catch((res) => {
        this.setState({ errors: null, isSubmitting: false })
        this.setState({ errors: res.data.errors })
      })
  }

  render () {
    const { post } = this.state

    return (post
      ? <PostForm
          post={post}
          handleSubmit={this.handleSubmit}
          updateModel={this.updateModel}
          errors={this.state.errors}
          uploadProgress={this.state.uploadProgress}
          mediaChange={this.mediaChange}
          isSubmitting={this.state.isSubmitting}
          editMode={true}
        />
      : <div>Loading...</div>
    )
  }
}

EditPostView.need = [(params) => {
  return PostActions.fetchPost(params.postId)
}]

function mapStateToProps (state, props) {
  const getMaecenate = getMaecenateByPost(getPostById)
  return {
    post: getPostById(state, props),
    maecenate: getMaecenate(state, props)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(EditPostView)
)

