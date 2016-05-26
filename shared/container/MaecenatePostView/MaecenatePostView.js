import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import * as Actions from '../../actions/actions'

import { Card, CardContent, CardTitle, CardActions } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'

class MaecenatePostView extends Component {

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateModel = this.updateModel.bind(this)
    this.state = {
      post: Immutable({ }),
      errors: null,
      isSubmitting: false
    }
  }

  updateModel (path, value) {
    this.setState({ post: this.state.post.setIn(path, value) })
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, maecenate } = this.props
    const { post: data } = this.state

    const post = data.set('maecenate', maecenate.id)

    this.setState({ isSubmitting: true })

    axios.post('/api/createPost', { post })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        dispatch(Actions.createMaecenatePostSuccess(data))
        browserHistory.push(`/maecenate/${maecenate.slug}`)
      }).catch((res) => {
        this.setState({ errors: null })
        this.setState({ errors: res.data.errors, isSubmitting: false })
      })
  }

  render () {
    const { maecenate } = this.props
    const { post } = this.state

    return (
      <ContentWrapper>
        {maecenate
          ? <Card>
              <CardTitle title='Create new post' />
              <Form onSubmit={this.handleSubmit} model={post}
                updateModel={this.updateModel}>
                <CardContent>

                    <TextField
                      path={['title']}
                      placeholder='Post title' />

                    <TextField
                      path={['content']}
                      placeholder='Post content'
                      multiLine={true}
                      rows={2} />

                </CardContent>
                <CardActions>
                  <Button
                    type='submit'
                    label='Create Post'
                    primary={true}
                    disabled={this.state.isSubmitting === true} />
                </CardActions>
              </Form>
            </Card>
          : <div>Loading...</div>
        }
      </ContentWrapper>
    )
  }
}

MaecenatePostView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (store) {
  const { app, entities } = store
  const maecenate = entities.maecenates[app.maecenate] || null

  return { maecenate }
}

export default connect(mapStateToProps)(MaecenatePostView)

