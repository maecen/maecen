import React, { PropTypes } from 'react'

import styleVariables from '../styleVariables'
import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle, CardHeader } from '../../components/Card'
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
      marginLeft: styleVariables.spacer.base,
      marginBottom: '-' + styleVariables.spacer.base,
      marginTop: styleVariables.spacer.base
    },
    header: {
      position: 'absolute',
      right: '0px',
      top: styleVariables.spacer.double
    },
    wrap: {
      padding: styleVariables.layout.wrap
    }
  }

  return (
    <div>
      <Row>
        <Col mdOffset={2} md={8} smOffset={1} sm={10} xs={12}>
          <Card>
            <Avatar
              src={cropCloudy(logo.url, 'logo-tiny')}
              size={60}
              style={style.avatar}
            />
            <CardTitle big={true} title={maecenate.title} />
            {isAuthUserOwner &&
              <IconButton
                style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
                onClick={editMaecenate} >
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
            <CardHeader
              title={maecenate.teaser}
            />
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
                    style={{color: 'inherit'}}>
                    &nbsp;{url}
                  </a>
                </span>
              }
              {!isAuthUserOwner &&
                <Button
                  primary={true}
                  label={t('support.join')}
                  onClick={supportMaecenate}
                  style={{marginTop: '16px'}}
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
