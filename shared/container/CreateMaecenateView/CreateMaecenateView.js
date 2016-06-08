import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { mediaUpload } from '../../lib/fileHandler'
import * as Actions from '../../actions/actions'

import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import { Card, CardContent, CardTitle } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import MediaField from '../../components/Form/MediaField'
import Button from '../../components/Form/Button'
import FileDropzone from '../../components/Form/FileDropzone'

class CreateMaecenateContainer extends Component {

  constructor (props) {
    super()
    this.state = {
      errors: null,
      maecenate: Immutable({ }),
      coverUploadProgress: 0,
      isSubmitting: false
    }

    this.coverChange = this.coverChange.bind(this)
  }

  updateModel (path, value) {
    if (value && path[0] === 'monthly_minimum') {
      if (value.match(/^[0-9]*$/)) {
        value = Number(value).toFixed(0)
      } else {
        return
      }
    }
    const maecenate = this.state.maecenate.setIn(path, value)
    this.setState({maecenate})
  }

  coverChange (files) {
    mediaUpload(files, {
      setState: this.setState.bind(this),
      uploadProgressProp: 'coverUploadProgress'
    }).then((data) => {
      this.updateModel(['cover_media'], data.result[0])
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { maecenate: data } = this.state

    this.setState({ isSubmitting: true })

    const maecenate = data.set('url', (data.url || '').replace(/https?:\/\//i, ''))

    axios.post('/api/createMaecenate', { maecenate })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        const slug = data.entities.maecenates[data.result[0]].slug
        dispatch(Actions.createMaecenateSuccess(data))
        browserHistory.push(`/maecenate/${slug}`)
      }, (res) => {
        this.setState({ errors: null })
        this.setState({ errors: res.data.errors, isSubmitting: false })
      })
  }

  render () {
    const { maecenate } = this.state
    const { t } = this.props

    return (
      <ContentWrapper>
        <Card>
          <CardTitle
            title={t('mc.create')}
            style={{paddingBottom: '0px'}}
          />
            <CardContent>

            <Form onSubmit={this.handleSubmit.bind(this)} model={maecenate}
              updateModel={this.updateModel.bind(this)}
              errors={this.state.errors}>

              <TextField
                path={['title']}
                label={t('title')} />
              <br />

              <MediaField
                label={t('logo')}
                path={['logo_url']} />
              <br />

              <FileDropzone
                multiple={false}
                label='Upload Cover'
                accept='video/*,image/*'
                onChange={this.coverChange} />
              <br />

              <TextField
                path={['teaser']}
                label={t('mc.teaser')}
                placeholder={t('mc.teaserPlaceholder')}
                maxLength='140' />
              <br />

              <TextField
                path={['description']}
                label={t('mc.description')}
                placeholder={t('mc.descriptionPlaceholder')}
                multiLine={true} />
              <br />

              <TextField
                path={['url']}
                label={t('mc.website')}
                placeholder={t('mc.websitePlaceholder')} />
              <br />

              <TextField
                fullWidth={false}
                path={['monthly_minimum']}
                label={t('mc.subscriptionPrice')}
                placeholder={t('mc.subscriptionPricePlaceholder')} />
              <br />

              <Button type='submit'
                style={{marginTop: '16px'}}
                primary={true}
                label={t('mc.create')}
                disabled={this.state.isSubmitting === true} />
            </Form>
          </CardContent>
        </Card>
      </ContentWrapper>
    )
  }
}

CreateMaecenateContainer.need = []

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(CreateMaecenateContainer)
)
