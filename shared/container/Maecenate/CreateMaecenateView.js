import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { mediaUpload } from '../../lib/fileHandler'
import * as Actions from '../../actions'

import { MaecenateForm } from '../../components/Maecenate'

class CreateMaecenateView extends Component {

  constructor (props) {
    super()
    this.state = {
      errors: null,
      maecenate: Immutable({ }),
      coverUploadProgress: 0,
      logoUploadProgress: 0,
      isSubmitting: false
    }

    this.coverChange = this.coverChange.bind(this)
    this.logoChange = this.logoChange.bind(this)
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

  logoChange (files) {
    mediaUpload(files, {
      setState: this.setState.bind(this),
      uploadProgressProp: 'logoUploadProgress'
    }).then((data) => {
      this.updateModel(['logo_media'], data.result[0])
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { maecenate: data } = this.state

    this.setState({ isSubmitting: true })

    const maecenate = data.set('url', (data.url || '').replace(/https?:\/\//i, ''))

    axios.post('/api/maecenates/create', { maecenate })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        const slug = data.entities.maecenates[data.result[0]].slug
        dispatch(Actions.createMaecenateSuccess(data))
        browserHistory.push(`/${slug}`)
      }, (res) => {
        this.setState({ errors: null })
        this.setState({ errors: res.data.errors, isSubmitting: false })
      })
  }

  render () {
    const { maecenate } = this.state
    const { t } = this.props

    let title = t('maecenate.create')
    let submitLable = t('maecenate.create')

    return (
      <MaecenateForm
        maecenate={maecenate}
        title={title}
        submitLable={submitLable}
        handleSubmit={this.handleSubmit.bind(this)}
        updateModel={this.updateModel.bind(this)}
        errors={this.state.errors}
        logoUploadProgress={this.state.logoUploadProgress}
        coverUploadProgress={this.state.coverUploadProgress}
        areWeSubmitting={this.state.isSubmitting === true}
        coverChange={this.coverChange}
        logoChange={this.logoChange}
      />
    )
  }
}

CreateMaecenateView.need = []

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(CreateMaecenateView)
)
