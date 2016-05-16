import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'

import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import s from './LoginContainer.scss'

import * as Actions from '../actions/actions'
import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import SelectField from '../components/Form/SelectField'
import ImageField from '../components/Form/ImageField'
import Button from '../components/Form/Button'

class CreateMaecenateContainer extends Component {

  constructor (props) {
    super()
    this.state = {
      errors: null,
      maecenate: Immutable({ })
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

    axios.post('/api/createMaecenate', { maecenate })
      .then(res => res.data)
      .then((data) => {
        this.setState({ errors: null })
        dispatch(Actions.createMaecenateSuccess(data))
      }, (res) => {
        this.setState({ errors: res.data.errors })
      })
  }

  render () {
    const { maecenate } = this.state

    return (
      <ContentWrapper>
        <div className={s.card}>

          <Form onSubmit={this.handleSubmit.bind(this)} model={maecenate}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <TextField
              path={['title']}
              label='Title' />
            <br />

            <ImageField
              label='Logo'
              path={['logoUrl']} />
            <br />

            <SelectField
              path={['category']}
              label='Category'>
              <option value=''>Pick a category...</option>
            </SelectField>
            <br />

            <TextField
              path={['teaser']}
              label='Teaser'
              placeholder='Max 140 characters'
              maxLength='140' />
            <br />

            <TextField
              path={['description']}
              label='Description'
              placeholder='Description of the maecenate'
              multiLine={true} />
            <br />

            <TextField
              path={['url']}
              label='Website'
              placeholder='Your website' />
            <br />

            <ImageField
              label='Cover'
              path={['coverUrl']} />
            <br />

            <Button type='submit' label='Create Maecenate' />
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

export default connect(mapStateToProps)(CreateMaecenateContainer)
