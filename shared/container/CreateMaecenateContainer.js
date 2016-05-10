import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import SelectField from '../components/Form/SelectField'
import ImageField from '../components/Form/ImageField'

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
      <div>
        <HeaderContainer />
        <div className='container'>

          <Form onSubmit={this.handleSubmit.bind(this)} model={maecenate}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <TextField
              path={['title']}
              label='Title'
              placeholder='Dodo and the dodos' />

            <ImageField
              label='Logo'
              path={['logoUrl']} />

            <SelectField
              path={['category']}
              label='Category'>
              <option value=''>Pick a category...</option>
            </SelectField>

            <TextField
              path={['teaser']}
              label='Teaser'
              placeholder='Max 140 characters'
              maxLength='140' />

            <TextField
              path={['description']}
              label='Description'
              placeholder='Description of the maecenate'
              rows='5'
              multiline={true} />

            <TextField
              path={['url']}
              label='Website'
              placeholder='Your website' />

            <ImageField
              label='Cover'
              path={['coverUrl']} />

            <button>Create Maecenate</button>
          </Form>

        </div>
      </div>
    )
  }
}

CreateMaecenateContainer.need = []

function mapStateToProps (store) {
  return { }
}

export default connect(mapStateToProps)(CreateMaecenateContainer)
