import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid/lib'
import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import {
  getMaecenateBySlug,
  isAuthUserMaecenateOwner
} from '../selectors/maecenate.selectors'
import * as Actions from '../actions/actions'
import Button from '../components/Form/Button'

import s from './MaecenateView.scss'

class MaecenateView extends Component {

  constructor (props) {
    super(props)
    this.createPost = this.createPost.bind(this)
    this.gotoContent = this.gotoContent.bind(this)
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  createPost () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/new-post`)
  }

  gotoContent () {
    const { slug } = this.props.params
    browserHistory.push(`/maecenate/${slug}/content`)
  }

  render () {
    const { maecenate, isAuthUserOwner } = this.props

    return (
      <ContentWrapper>
        {maecenate
          ? <Row className={s.main}>
              <Col xs={12}>
                <h2 className={s.title}>{maecenate.title}</h2>
              </Col>
              <Col xs={2}>
                <img src={maecenate.logo_url} className={s.logo} />
                <p>Maecens: 0</p>
                <p>Content posts: 0</p>
                <p>Min. amount: 1€</p>
                {maecenate.url &&
                  <p>
                    Website:
                    <a href={`http://${maecenate.url}`} target='_blank'>
                      Visit
                    </a>
                  </p>
                }
                {isAuthUserOwner &&
                  <Button label='Create Post' onClick={this.createPost} />
                }
                <Button label='See Content' onClick={this.gotoContent} />
              </Col>
              <Col xs={10}>
                <img src={maecenate.cover_url} className={s.cover} />
                <p className={s.teaser}>{maecenate.teaser}</p>
                <p>{maecenate.description}</p>
              </Col>
            </Row>
          : <div>Loading...</div>
        }
      </ContentWrapper>
    )
  }
}

MaecenateView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    maecenate: getMaecenateBySlug(state, props),
    isAuthUserOwner: isAuthUserMaecenateOwner(state, props)
  }
}

export default connect(mapStateToProps)(MaecenateView)
