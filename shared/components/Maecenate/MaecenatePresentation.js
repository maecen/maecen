import React, { PropTypes } from 'react'

import styleVariables from '../styleVariables'
import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle } from '../../components/Card'
import { translate } from 'react-i18next'
import cropCloudy from '../../lib/cropCloudy'
import Avatar from 'material-ui/Avatar'
import Button from '../Form/Button'
import Media from '../Media/Media'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

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

  const style = {
    avatar: {
      margin: styleVariables.spacer.base,
      marginRight: '0px',
      marginTop: styleVariables.spacer.base,
      flexShrink: '0'
    },
    header: {
      position: 'absolute',
      right: '0px',
      top: styleVariables.spacer.double
    },
    wrap: {
      padding: styleVariables.layout.wrap
    },
    button: {
      position: 'absolute',
      right: styleVariables.spacer.base,
      bottom: styleVariables.spacer.base
    },
    link: {
      color: styleVariables.color.primary,
      textDecoration: 'none'
    },
    subtitle: {
      fontWeight: styleVariables.font.weight.subtitle
    },
    titleWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    titleSubtitle: {
      display: 'none'
    }
  }

  return (
    <div>
      <Row>
        <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
          <Card>
            <div style={style.titleWrap}>
              <Avatar
                src={cropCloudy(logo.url, 'logo-tiny')}
                size={60}
                style={style.avatar}
              />
              <CardTitle big={true}
                title={maecenate.title}
                subtitleStyle={style.titleSubtitle}
              />
            </div>
            {isAuthUserOwner &&
              <IconButton
                style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
                onTouchTap={editMaecenate} >
                <EditIcon />
              </IconButton>
            }
          </Card>
          <Card>
            <CardContent>
              {cover &&
                <Media type={cover.type} url={cover.url} fixedRatio={true} />
              }
            </CardContent>
            <CardContent style={style.subtitle}>
              { maecenate.teaser }
            </CardContent>
            <CardContent>
              {maecenate.description}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              {t('support.minimumAmount',
                { context: 'DKK', count: monthlyMinimum })}
              <br />
              {url &&
                <span>
                  {t('website')}:
                  <a
                    href={`http://${url}`}
                    target='_blank'
                    style={style.link}>
                    &nbsp;{url}
                  </a>
                </span>
              }
              {!isAuthUserOwner &&
                <Button
                  primary={true}
                  last={true}
                  label={t('support.join')}
                  onClick={supportMaecenate}
                  style={style.button}
                />
              }
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
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
