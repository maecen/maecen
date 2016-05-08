import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import SelectField from '../components/Form/SelectField'

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

    axios.post('/api/createMaecenate', { maecenate }).then((res) => {
      return res.data
    }).then((data) => {
      dispatch(Actions.createMaecenateSuccess(data))
      const id = data.result[0]
      const {slug} = data.entities.maecenates[id]
      browserHistory.push(`/maecenate/${slug}`)
      this.setState({ errors: null })
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
