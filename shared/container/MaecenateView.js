import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { startsWith } from 'strman'

import { Row, Col } from 'react-flexbox-grid/lib'
import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import { Card, CardContent, CardTitle, CardHeader } from '../components/Card'

import {
  getMaecenateBySlug,
  isAuthUserMaecenateOwner
} from '../selectors/Maecenate.selectors'
import * as Actions from '../actions/actions'
import cropCloudy from '../lib/cropCloudy'
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
    const { cover_type: coverType, cover_url: coverUrl } = maecenate
    var coverCropped = ''
    if (coverType !== 'video') {
      coverCropped = cropCloudy(coverUrl, 'cover')
    }
    const logoCropped = cropCloudy(maecenate.logo_url, 'logo')

    return (
      <ContentWrapper>
        {maecenate
          ? <Card>
              <CardTitle
                big={true}
                title={maecenate.title}
                style={{paddingBottom: '0px'}}
              />
                <Row>
                  <Col xs={5} sm={3} md={2}>
                    <CardContent>
                      <img src={logoCropped} className={s.logo} />
                      <p>Maecens: 0</p>
                      <p>Content posts: 0</p>
                      <p>Min. amount: 1€</p>
                      {maecenate.url &&
                        <p>
                          Website:
                          <a
                            href={`http://${maecenate.url}`}
                            target='_blank'
                            className={s.link}>
                            &nbsp;{maecenate.url}
                          </a>
                        </p>
                      }
                      {isAuthUserOwner &&
                        <Button
                          primary={true}
                          label='Create Post'
                          onClick={this.createPost}
                        />
                      }
                      <Button
                        primary={true}
                        label='See Content'
                        onClick={this.gotoContent}
                        style={{marginTop: '16px'}}
                      />
                    </CardContent>
                  </Col>
                  <Col xs={7} sm={9} md={10}>
                    <CardContent>
                      {coverUrl && startsWith(coverType, 'video')
                        ? <video width='100%' src={coverUrl} controls />
                        : <img src={coverCropped} width='100%' />
                      }
                    </CardContent>
                    <CardHeader
                      title={maecenate.teaser}
                      style={{paddingBottom: '0px'}}
                    />
                    <CardContent style={{paddingBottom: '32px'}}>
                      {maecenate.description}
                    </CardContent>
                  </Col>
                </Row>
            </Card>
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
