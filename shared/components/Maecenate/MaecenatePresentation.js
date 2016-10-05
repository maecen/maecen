import React, { PropTypes } from 'react'

import styleVariables from '../styleVariables'
import { Row, Cell } from '../Grid'
import { Card, CardContent, CardBigTitle } from '../../components/Card'
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

  return (
    <Row>
      <Cell narrowLayout={true}>
        <Card>
          <div style={style.titleWrap}>
            <Avatar
              src={cropCloudy(logo.url, 'logo-tiny')}
              size={60}
              style={style.avatar}
            />
            <CardBigTitle>
              {maecenate.title}
            </CardBigTitle>
          </div>
          {isAuthUserOwner &&
            <IconButton
              style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
              onTouchTap={editMaecenate} >
              <EditIcon />
            </IconButton>
          }
        </Card>
        {maecenate.active ||
          <Card>
            <CardContent style={style.closedMessage}>
              { t('maecenate.closedSupporterMessage') }
            </CardContent>
          </Card>
        }
        <Card>
          <CardContent>
            {cover &&
              <Media type={cover.type} url={cover.url} fixedRatio={true} />
            }
          </CardContent>
          <CardContent style={style.subtitle}>
            { maecenate.teaser }
          </CardContent>
          <CardContent style={style.description}>
            {maecenate.description}
          </CardContent>
        </Card>
        { maecenate.active &&
          <Card>
            <CardContent style={style.flexMe}>
              <div>
                {t('support.minimumAmount',
                  { context: 'DKK', count: monthlyMinimum })}
                {url &&
                  <span>
                    <br />
                    {t('website')}:
                    <a
                      href={`http://${url}`}
                      target='_blank'
                      style={style.link}>
                      &nbsp;{url}
                    </a>
                  </span>
                }
              </div>
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
        }
      </Cell>
    </Row>
  )
}

const { spacer, font, color } = styleVariables

const style = {
  avatar: {
    marginTop: spacer.base,
    marginRight: 0,
    marginBottom: spacer.base,
    marginLeft: spacer.base,
    flexShrink: '0'
  },
  header: {
    position: 'absolute',
    right: '0px',
    top: spacer.double
  },
  link: {
    color: color.primary,
    textDecoration: 'none'
  },
  subtitle: {
    fontWeight: font.weight.subtitle
  },
  description: {
    whiteSpace: 'pre-line'
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  flexMe: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  button: {
    flexShrink: '0',
    marginLeft: 'auto',
    marginTop: spacer.base
  },
  closedMessage: {
    fontWeight: font.weight.subtitle,
    textAlign: 'center'
  }
}

MaecenatePresentation.propTypes = {
  maecenate: PropTypes.object.isRequired,
  supportMaecenate: PropTypes.func.isRequired,
  editMaecenate: PropTypes.func.isRequired
}

export default translate(['common'])(
  MaecenatePresentation
)
