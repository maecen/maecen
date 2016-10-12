import React, { PropTypes } from 'react'

import styleVariables from '../styleVariables'
import { Card, CardContent, CardBigTitle } from '../../components/Card'
import { translate } from 'react-i18next'
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
    url: url,
    monthly_minimum: monthlyMinimum
  } = maecenate

  return (
    <div style={style.container}>
      <Card>
        <div style={style.cardContainer}>
          <CardBigTitle style={style.title}>
            {maecenate.title}
          </CardBigTitle>
          {isAuthUserOwner &&
            <IconButton
              style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
              onTouchTap={editMaecenate} >
              <EditIcon />
            </IconButton>
          }
          {maecenate.active ||
            <CardContent style={style.closedMessage}>
              { t('maecenate.closedSupporterMessage') }
            </CardContent>
          }
          <CardContent>
            {cover &&
              <Media type={cover.type} url={cover.url} fixedRatio={true} />
            }
          </CardContent>
          <CardContent style={style.description}>
            <div style={style.subtitle}>
              { maecenate.teaser }
            </div>
            {maecenate.description}
            {url &&
              <div style={style.url}>
                {t('website')}:
                <a
                  href={`http://${url}`}
                  target='_blank'
                  style={style.link}>
                  &nbsp;{url}
                </a>
              </div>
            }
          </CardContent>
          { maecenate.active &&
            <CardContent>
              <div style={style.flexMe}>
                <div>
                  {t('support.minimumAmount',
                    { context: 'DKK', count: monthlyMinimum })}
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
              </div>
            </CardContent>
          }
        </div>
      </Card>
    </div>
  )
}

const { spacer, font, color, border, defaults } = styleVariables
const style = {
  container: {
    width: '100%'
  },
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
    fontWeight: font.weight.subtitle,
    marginBottom: spacer.base
  },
  description: {
    whiteSpace: 'pre-line',
    margin: '0 auto',
    maxWidth: defaults.maxWidthText
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent
  },
  title: {
    textAlign: 'center',
    paddingTop: spacer.double,
    paddingBottom: spacer.base,
    borderBottom: `${border.thickness} solid ${color.background}`
  },
  flexMe: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderTop: `${border.thickness} solid ${color.background}`,
    paddingTop: spacer.double,
    paddingBottom: spacer.base
  },
  button: {
    flexShrink: '0',
    marginLeft: 'auto'
  },
  closedMessage: {
    fontWeight: font.weight.subtitle,
    textAlign: 'center'
  },
  url: {
    marginTop: spacer.base
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
