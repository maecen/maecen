// Imports
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import Immutable from 'seamless-immutable'

// Utils
import { postStatus } from '../../config'
import { mediaUpload, fileUpload } from '../../lib/fileHandler'

// Actions & Selectors
import * as Actions from '../../actions'
import { getPostById } from '../../selectors/post'
import { getMaecenateByPost } from '../../selectors/maecenate'

// Components
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
      media: [],
      files: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateModel = this.updateModel.bind(this)
    this.mediaChange = this.mediaChange.bind(this)
    this.fileChange = this.fileChange.bind(this)
    this.toggleVisible = this.toggleVisible.bind(this)
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

  toggleVisible (event, check) {
    const status = check ? postStatus.PUBLISHED : postStatus.HIDDEN
    this.setState({
      post: this.state.post.set('status', status)
    })
  }

  mediaChange (files) {
    this.setState({ media: files })
    mediaUpload(files, {
      setState: this.setState.bind(this)
    }).then((data) => {
      this.updateModel(['media'], data.result)
    })
  }

  fileChange (files) {
    this.setState({ files })
    fileUpload(files, {
      setState: this.setState.bind(this)
    }).then((data) => {
      this.updateModel(['file'], data.result)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, maecenate } = this.props
    const { post } = this.state

    this.setState({ isSubmitting: true })
    axios.put(`/api/posts/${post.id}/edit`, { post })
      .then(res => res.data)
      .then(data => {
        this.setState({ errors: null, isSubmitting: false })
        dispatch(Actions.editPostSuccess(data))
        browserHistory.push(`/${maecenate.slug}`)
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
          fileChange={this.fileChange}
          isSubmitting={this.state.isSubmitting}
          toggleVisible={this.toggleVisible}
          editMode={true}
        />
      : <div>Loading...</div>
    )
  }
}

EditPostView.need = [(params) => {
  return Actions.fetchPost(params.postId)
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

