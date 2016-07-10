import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import find from 'lodash/find'

import * as Actions from '../../actions'
import { mediaUpload } from '../../lib/fileHandler'
import { getUserMaecenates } from '../../selectors/maecenate'
import { getAuthUser, getAuthUserId } from '../../selectors/user'

import PostForm from '../../components/Post/PostForm'

class CreatePostView extends Component {

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateModel = this.updateModel.bind(this)
    this.mediaChange = this.mediaChange.bind(this)
    this.onChangeMaecenate = this.onChangeMaecenate.bind(this)
    this.state = {
      post: Immutable({ }),
      errors: null,
      isSubmitting: false,
      mediaPreview: null,
      uploadProgress: 0,
      media: []
    }
  }

  componentDidMount () {
    const { dispatch, params, state, maecenates } = this.props
    const maecenateId = getLastMaecenate(maecenates)
    dispatch(this.constructor.need[0](params, state))
    this.setAuthorAlias(this.props)
    this.maecenateChange(maecenateId)
  }

  updateModel (path, value) {
    this.setState({ post: this.state.post.setIn(path, value) })
  }

  setAuthorAlias (props) {
    // We set the author_alias if it's not set but the user has a default
    if (!this.state.author_alias) {
      this.setState({
        post: this.state.post.set('author_alias', getDefaultAlias(props))
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setAuthorAlias(nextProps)
    if (this.props.maecenates !== nextProps.maecenates) {
      const maecenateId = getLastMaecenate(nextProps.maecenates)
      this.maecenateChange(maecenateId)
    }
  }

  maecenateChange (maecenateId) {
    const alias = getDefaultAlias(this.props, maecenateId)
    const post = this.state.post.merge({
      maecenate: maecenateId,
      author_alias: alias
    })
    this.setState({ post })
  }

  onChangeMaecenate (event, index, maecenateId) {
    this.maecenateChange(maecenateId)
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
    const { dispatch, maecenates } = this.props
    const { post } = this.state

    const maecenate = find(maecenates, obj => obj.id === post.maecenate)

    this.setState({ isSubmitting: true })
    axios.post('/api/createPost', { post })
      .then(res => res.data)
      .then(data => {
        this.setState({ errors: null, isSubmitting: false })
        dispatch(Actions.createPostSuccess(data))
        setDefaultAlias(this.props, post.author_alias, maecenate.id)
        setLastMaecenate(maecenate.id)
        browserHistory.push(`/maecenate/${maecenate.slug}`)
      }).catch((res) => {
        this.setState({ errors: null, isSubmitting: false })
        this.setState({ errors: res.data.errors })
      })
  }

  render () {
    const { maecenates } = this.props
    const { post } = this.state

    return (maecenates
      ? <PostForm
          maecenates={maecenates}
          post={post}
          handleSubmit={this.handleSubmit}
          updateModel={this.updateModel}
          errors={this.state.errors}
          onChangeMaecenate={this.onChangeMaecenate}
          uploadProgress={this.state.uploadProgress}
          mediaChange={this.mediaChange}
          isSubmitting={this.state.isSubmitting}
        />
      : <div>Loading...</div>
    )
  }
}

CreatePostView.need = [(params, state) => {
  const userId = getAuthUserId(state)
  return Actions.fetchAdminMaecenateList(userId)
}]

function mapStateToProps (state, props) {
  const getMaecenates = getUserMaecenates(getAuthUserId)
  return {
    maecenates: getMaecenates(state, props),
    authUser: getAuthUser(state, props),
    state
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(CreatePostView)
)

// Helper methods
// ==============
function getDefaultAlias (props, maecenateId) {
  const { authUser } = props
  let alias = null
  if (window && window.localStorage) {
    alias = window.localStorage.getItem(`alias-for-${maecenateId}`)
  }

  if (!alias && authUser && authUser.alias) {
    alias = authUser.alias
  }

  return alias
}

function setDefaultAlias (props, alias, maecenateId) {
  if (window && window.localStorage) {
    window.localStorage.setItem(`alias-for-${maecenateId}`, alias)
  }
}

function getLastMaecenate (options) {
  options = options || []
  const defaultMaecenateId = options[0] && options[0].id
  let maecenateId = null
  if (window && window.localStorage) {
    maecenateId = window.localStorage.getItem('default-maecenate') ||
      defaultMaecenateId

    // Check the `maecenateId` is a valid choice
    if (options.map(o => o.id).includes(maecenateId) === false) {
      maecenateId = defaultMaecenateId
    }
  }
  return maecenateId
}

function setLastMaecenate (maecenateId) {
  if (window && window.localStorage) {
    window.localStorage.setItem('default-maecenate', maecenateId)
  }
}