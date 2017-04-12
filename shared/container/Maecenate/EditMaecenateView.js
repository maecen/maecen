// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { browserHistory } from 'react-router'
import pick from 'lodash/pick'
import axios from 'axios'
import Immutable from 'seamless-immutable'

// Utils
import { mediaUpload } from '../../lib/fileHandler'

// Selectors & Actions
import * as Actions from '../../actions'
import {
  getMaecenateBySlug
} from '../../selectors/maecenate'
import { getRequestDetails } from '../../selectors/app'

import { MaecenateForm } from '../../components/Maecenate'

class EditMaecenateView extends Component {

  constructor (props) {
    super()
    this.state = {
      errors: null,
      maecenate: null,
      coverUploadProgress: 0,
      logoUploadProgress: 0,
      isSubmitting: false
    }

    this.coverChange = this.coverChange.bind(this)
    this.logoChange = this.logoChange.bind(this)
  }

  componentWillMount () {
    const maecenate = pick(this.props.maecenate, [
      'title',
      'logo_media',
      'cover_media',
      'teaser',
      'description',
      'url',
      'monthly_minimum'
    ])
    this.setState({ maecenate: Immutable(maecenate) || null })
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.maecenate === null &&
        this.state.maecenate !== nextProps.maecenate) {
      this.setState({ maecenate: Immutable(nextProps.maecenate) })
    }
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

    const { maecenate } = this.props
    const maecenateData = data.set('url', (data.url || '').replace(/https?:\/\//i, ''))

    axios.put(`/api/maecenates/${maecenate.slug}/admin/edit`, {
      maecenate: {
        id: maecenate.id,
        ...maecenateData
      }
    })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        const slug = data.entities.maecenates[data.result[0]].slug
        dispatch(Actions.editMaecenateSuccess(data))
        browserHistory.push(`/${slug}/presentation`)
      }, (res) => {
        this.setState({ errors: null, isSubmitting: false })
        this.setState({ errors: res.data.errors })
      })
  }

  render () {
    const { maecenate } = this.state

    return (maecenate
      ? <MaecenateForm
          editMode={true}
          maecenate={maecenate}
          handleSubmit={this.handleSubmit.bind(this)}
          updateModel={this.updateModel.bind(this)}
          errors={this.state.errors}
          logoUploadProgress={this.state.logoUploadProgress}
          coverUploadProgress={this.state.coverUploadProgress}
          isSubmitting={this.state.isSubmitting === true}
          coverChange={this.coverChange}
          logoChange={this.logoChange}
          request={this.props.request}
        />
      : <div>Loading...</div>
    )
  }
}

EditMaecenateView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    maecenate: getMaecenateBySlug(state, props),
    request: getRequestDetails(state)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(EditMaecenateView)
)
