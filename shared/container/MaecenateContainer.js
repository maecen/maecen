import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid/lib'
import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import * as Actions from '../actions/actions'

import s from './MaecenateContainer.scss'

class MaecenateContainer extends Component {

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  render () {
    const { maecenate } = this.props

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

MaecenateContainer.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (store) {
  const { app, entities } = store
  const maecenate = entities.maecenates[app.maecenate] || null

  return { maecenate }
}

export default connect(mapStateToProps)(MaecenateContainer)
