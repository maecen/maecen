import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import find from 'lodash/find'

import * as Actions from '../../actions/actions'
import { mediaUpload } from '../../lib/fileHandler'
import { getUserMaecenates } from '../../selectors/Maecenate.selectors'
import { getAuthUser, getAuthUserId } from '../../selectors/User.selectors'

import { Row, Col } from 'react-flexbox-grid/lib'

import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import { Card, CardContent, CardTitle, CardActions } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'
import LinearProgressDeterminate from '../../components/Progress/LinearProgress'
import FileDropzone from '../../components/Form/FileDropzone'

class CreatePostView extends Component {

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateModel = this.updateModel.bind(this)
    this.mediaChange = this.mediaChange.bind(this)
    this.state = {
      post: Immutable({ }),
      errors: null,
      isSubmitting: false,
      mediaPreview: null,
      uploadProgress: 0,
      media: []
    }
    this.onChangeMaecenate = this.onChangeMaecenate.bind(this)
  }

  componentDidMount () {
    const { dispatch, params, state, maecenates } = this.props
    const maecenateId = getLastMaecenate(maecenates[0] && maecenates[0].id)
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
      const maecenateId = getLastMaecenate(nextProps.maecenates[0].id)
      this.maecenateChange(maecenateId)
    }
  }

  mediaChange (files) {
    this.setState({ media: files })
    mediaUpload(files, {
      setState: this.setState.bind(this)
    }).then((data) => {
      this.updateModel(['media'], data.result)
    })
  }

  maecenateChange (maecenateId) {
    const alias = getDefaultAlias(this.props, maecenateId)
    const post = this.state.post.merge({
      maecenate: maecenateId,
      author_alias: alias
    })
    this.setState({ post })
  }

  onChangeMaecenate (event) {
    this.maecenateChange(event.target.value)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, maecenates } = this.props
    const { post } = this.state

    console.log(post.maecenate)
    const maecenate = find(maecenates, obj => obj.id === post.maecenate)

    this.setState({ isSubmitting: true })
    axios.post('/api/createPost', { post })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        dispatch(Actions.createMaecenatePostSuccess(data))
        setDefaultAlias(this.props, post.author_alias, maecenate.id)
        setLastMaecenate(maecenate.id)
        browserHistory.push(`/maecenate/${maecenate.slug}`)
      }).catch((res) => {
        console.log(res)
        this.setState({ errors: null, isSubmitting: false })
        this.setState({ errors: res.data.errors })
      })
  }

  render () {
    const { maecenates, t } = this.props
    const { post, mediaPreview } = this.state

    return (
      <ContentWrapper>
        <Row>
          <Col smOffset={3} sm={6} xs={12}>
            {maecenates
              ? <Card>
                  <CardTitle title={t('post.create')} />
                  <Form onSubmit={this.handleSubmit} model={post}
                    updateModel={this.updateModel} errors={this.state.errors}>
                    <CardContent>

                      <TextField
                        path={['title']}
                        placeholder={t('post.title')} />

                      <FileDropzone
                        multiple={false}
                        label={t('media.upload')}
                        accept='video/*,image/*'
                        onChange={this.mediaChange} />

                      <LinearProgressDeterminate
                        value={this.state.uploadProgress} />

                      {mediaPreview &&
                        <img src={mediaPreview} width='100%' /> }

                      <TextField
                        path={['content']}
                        placeholder={t('post.content')}
                        multiLine={true} />

                      <TextField
                        path={['author_alias']}
                        placeholder={t('user.alias')}
                        fullWidth={false} />

                      <select onChange={this.onChangeMaecenate} value={this.state.post.maecenate}>
                        {maecenates.map((maecenate, i) => (
                          <option
                            value={maecenate.id}
                            key={maecenate.id}
                          >
                            {maecenate.title}
                          </option>
                        ))}
                      </select>

                    </CardContent>
                    <CardActions>
                      <Button
                        type='submit'
                        label={t('post.create')}
                        primary={true}
                        disabled={this.state.isSubmitting === true} />
                    </CardActions>
                  </Form>
                </Card>
              : <div>{t('loading')}</div>
            }
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}

CreatePostView.need = [(params, state) => {
  console.log(state)
  const userId = getAuthUserId(state)
  return Actions.fetchAdminMaecenateList(userId)
}]

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

function getLastMaecenate (maecenateId) {
  if (window && window.localStorage) {
    return window.localStorage.getItem('default-maecenate')
  }
  return maecenateId
}

function setLastMaecenate (maecenateId) {
  if (window && window.localStorage) {
    window.localStorage.setItem('default-maecenate', maecenateId)
  }
}

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
