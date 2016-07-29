import React, { PropTypes } from 'react'

import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle, CardHeader } from '../../components/Card'
import { translate } from 'react-i18next'
import cropCloudy from '../../lib/cropCloudy'
import Button from '../Form/Button'
import Media from '../Media/Media'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

import s from './MaecenatePresentation.scss'

function MaecenatePresentation (props) {
  const {
    maecenate,
    supportMaecenate,
    editMaecenate,
    isAuthUserOwner,
    t
  } = props

  const {
    cover,
    logo,
    url: url,
    monthly_minimum: monthlyMinimum
  } = maecenate

  return (
    <Card>
      <CardTitle
        big={true}
        title={maecenate.title}
        style={{paddingBottom: '0px'}}
      />
      {isAuthUserOwner &&
        <IconButton
          style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
          onClick={editMaecenate} >
          <EditIcon />
        </IconButton>
      }

        <Row>
          <Col xs={12} sm={3}>
            <CardContent>
              <Row>
                <Col xs={4} sm={12}>
                  <img src={cropCloudy(logo.url, 'logo')}
                    className={s.logo} />
                </Col>
                <Col xs={8} sm={12}>
                  <p>
                    {t('support.minimumAmount',
                      { context: 'DKK', count: monthlyMinimum })}
                  <br />
                  {url &&
                    <span>
                      {t('website')}:
                      <a
                        href={`http://${url}`}
                        target='_blank'
                        className={s.link}>
                        &nbsp;{url}
                      </a>
                    </span>
                  }
                  </p>
                  {!isAuthUserOwner &&
                    <Button
                      primary={true}
                      label={t('support.join')}
                      onClick={supportMaecenate}
                      style={{marginTop: '16px'}}
                    />
                  }
                </Col>
              </Row>
            </CardContent>
          </Col>
          <Col xs={12} sm={9}>
            <CardContent>
              {cover &&
                <Media type={cover.type} url={cover.url} fixedRatio={true} />
              }
            </CardContent>
            <CardHeader
              title={maecenate.teaser}
            />
            <CardContent>
              {maecenate.description}
            </CardContent>
          </Col>
        </Row>
    </Card>
  )
}

MaecenatePresentation.propTypes = {
  maecenate: PropTypes.object.isRequired,
  supportMaecenate: PropTypes.func.isRequired,
  editMaecenate: PropTypes.func.isRequired
}

export default translate(['common'])(
  MaecenatePresentation
)
