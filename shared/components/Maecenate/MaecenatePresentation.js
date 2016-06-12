import React, { PropTypes } from 'react'

import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle, CardHeader } from '../../components/Card'
import { translate } from 'react-i18next'
import cropCloudy from '../../lib/cropCloudy'
import Button from '../Form/Button'
import Media from '../Media/Media'

import s from './MaecenatePresentation.scss'

function MaecenatePresentation (props) {
  const { maecenate, isAuthUserOwner, isSupporter, supportMaecenate, t } = props
  const {
    cover_type: coverType,
    cover_url: coverUrl,
    logo_url: logoUrl,
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
        <Row>
          <Col xs={12} sm={3} lg={2}>
            <CardContent>
              <img src={cropCloudy(logoUrl, 'logo')}
                className={s.logo} />
              <p>{t('maecens')}: 0</p>
              <p>{t('post.posts')}: 0</p>
              <p>{t('support.minimumAmount')}: {monthlyMinimum} {t('currency.DKR')}</p>
              {url &&
                <p>
                  {t('website')}:
                  <a
                    href={`http://${url}`}
                    target='_blank'
                    className={s.link}>
                    &nbsp;{url}
                  </a>
                </p>
              }
              {isAuthUserOwner &&
                <Button
                  primary={true}
                  label={t('post.create')}
                  onClick={props.createPost}
                />
              }
              {(isSupporter === true || isAuthUserOwner === true) &&
                <Button
                  primary={true}
                  label={t('post.see')}
                  onClick={props.gotoContent}
                  style={{marginTop: '16px'}}
                />
              }
              {isAuthUserOwner === false && isSupporter === false &&
                <Button
                  primary={true}
                  label={t('support.join')}
                  onClick={supportMaecenate}
                  style={{marginTop: '16px'}}
                />
              }
            </CardContent>
          </Col>
          <Col xs={12} sm={9} lg={10}>
            <CardContent>
              <Media type={coverType} url={coverUrl} fixAspect={true} />
            </CardContent>
            <CardHeader
              title={maecenate.teaser}
              style={{paddingBottom: '0px'}}
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
  isAuthUserOwner: PropTypes.bool.isRequired,
  gotoContent: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired
}

export default translate(['common'])(
  MaecenatePresentation
)
