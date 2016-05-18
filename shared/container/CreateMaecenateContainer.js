import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'

import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import s from './LoginContainer.scss'
import * as Actions from '../actions/actions'
import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import ImageField from '../components/Form/ImageField'
import Button from '../components/Form/Button'

class CreateMaecenateContainer extends Component {

  constructor (props) {
    super()
    this.state = {
      errors: null,
      maecenate: Immutable({ }),
      isSubmitting: false
    }
  }

  updateModel (path, value) {
    const maecenate = this.state.maecenate.setIn(path, value)
    this.setState({maecenate})
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { maecenate } = this.state

    this.setState({ isSubmitting: true })

    axios.post('/api/createMaecenate', { maecenate })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null, isSubmitting: false })
        const slug = data.entities.maecenates[data.result[0]].slug
        dispatch(Actions.createMaecenateSuccess(data))
        browserHistory.push(`/maecenate/${slug}`)
      }, (res) => {
        this.setState({ errors: res.data.errors, isSubmitting: false })
      })
  }

  render () {
    const { maecenate } = this.state
    const { t } = this.props

    return (
      <ContentWrapper>
        <div className={s.card}>

          <Form onSubmit={this.handleSubmit.bind(this)} model={maecenate}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <TextField
              path={['title']}
              label={t('title')} />
            <br />

            <ImageField
              label={t('logo')}
              path={['logoUrl']} />
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

            <ImageField
            label={t('mc.coverImage')}
              path={['coverUrl']} />
            <br />

            <Button type='submit'
              label={t('mc.createMaecenate')}
              disabled={this.state.isSubmitting === true} />
          </Form>
        </div>
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
