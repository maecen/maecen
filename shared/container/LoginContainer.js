import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import axios from 'axios'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

class LoginContainer extends Component {

  constructor () {
    super()
    this.state = { type: null, message: null }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props

    let auth = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }

    axios.post('/api/authUser', { auth }).then((res) => {
      return res.data
    }).then((data) => {
      console.log('auth User', data)
      dispatch(Actions.setAuthUser(data.result[0], data.entities))
      browserHistory.push('/')
    }, (res) => {
      this.setState({ type: 'danger', message: res.data.errors.join('. ') })
    })
  }

  render () {
    return (
      <div>
        <HeaderContainer />
        <div className='container'>
          {this.state.type && this.state.message &&
            <div>{this.state.message}</div>
          }

          <form onSubmit={this.handleSubmit.bind(this)}>
            <label>Email</label>
            <input type='email' placeholder='Your email address' ref='email' />

            <label>Password</label>
            <input type='password' placeholder='Your password' ref='password' />

            <button>Login</button>
          </form>
          <Link to='/register'>Register</Link>

        </div>
      </div>
    )
  }
}

LoginContainer.need = []
LoginContainer.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (store) {
  return { }
}

export default connect(mapStateToProps)(LoginContainer)
