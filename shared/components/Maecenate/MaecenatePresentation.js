import React, { PropTypes } from 'react'
import { startsWith } from 'strman'

import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle, CardHeader } from '../../components/Card'
import cropCloudy from '../../lib/cropCloudy'
import Button from '../Form/Button'

import s from './MaecenatePresentation.scss'

export default function MaecenatePresentation (props) {
  const { maecenate, isAuthUserOwner } = props
  const { cover_type: coverType, cover_url: coverUrl } = maecenate

  let coverCropped = ''
  if (coverType !== 'video') {
    coverCropped = cropCloudy(coverUrl, 'cover')
  }
  const logoCropped = cropCloudy(maecenate.logo_url, 'logo')

  return (
    <Card>
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
                  onClick={props.createPost}
                />
              }
              <Button
                primary={true}
                label='See Content'
                onClick={props.gotoContent}
                style={{marginTop: '16px'}}
              />
            </CardContent>
          </Col>
          <Col xs={7} sm={9} md={10}>
            <CardContent>
              {coverUrl && startsWith(coverType, 'video')
                ? <video className={s.coverVideo} src={coverUrl} controls />
                : <img className={s.coverImage} src={coverCropped} />
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
  )
}

MaecenatePresentation.propTypes = {
  maecenate: PropTypes.object.isRequired,
  isAuthUserOwner: PropTypes.bool.isRequired,
  gotoContent: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired
}
