import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import HeaderContainer from './HeaderContainer'

class RegisterContainer extends Component {

  constructor () {
    super()
    this.state = { type: null, message: null }
  }

  handleSubmit (e) {
    e.preventDefault()
    const confirmPassword = this.refs.confirmPassword.value
    let user = {
      name: {
        first: this.refs.firstName.value,
        last: this.refs.lastName.value
      },
      email: this.refs.email.value,
      password: this.refs.password.value
    }

    if (confirmPassword !== user.password) {
      this.setState({ type: 'danger', message: 'The two passwords doesn\'t match' })
      return
    }

    axios.post('/api/createUser', { user }).then((res) => {
      this.setState({ type: 'success', message: 'SUCCESS!' })
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
            <label>First Name</label>
            <input type='text' placeholder='Your first name' ref='firstName' />

            <label>Last Name</label>
            <input type='text' placeholder='Your last name' ref='lastName' />

            <label>Email</label>
            <input type='email' placeholder='Your email address' ref='email' />

            <label>Password</label>
            <input type='password' placeholder='Your password' ref='password' />
            <label>Confirm Password</label>
            <input type='password' placeholder='Confirm password'
              ref='confirmPassword' />

            <button>Register</button>
          </form>
        </div>
      </div>
    )
  }
}

RegisterContainer.need = []
RegisterContainer.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (store) {
  return { }
}

export default connect(mapStateToProps)(RegisterContainer)
