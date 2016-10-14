import React, { PropTypes } from 'react'

import style from './MaecenateStyle'
import { Card, CardContent, CardBigTitle } from '../Card'
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
    description,
    teaser,
    title,
    url: url,
    monthly_minimum: monthlyMinimum
  } = maecenate

  return (
    <div style={style.mainContainer}>
      <Card>
        <div style={style.cardContainer}>
          <div style={style.titleWrap}>
            <CardBigTitle>
              { title }
            </CardBigTitle>
          </div>
          {isAuthUserOwner &&
            <IconButton
              style={style.editIcon}
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
          <CardContent textLayout={true}>
            <div style={style.subtitle}>
              { teaser }
            </div>
            { description }
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
              <div style={style.supportWrap}>
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

MaecenatePresentation.propTypes = {
  maecenate: PropTypes.object.isRequired,
  supportMaecenate: PropTypes.func.isRequired,
  editMaecenate: PropTypes.func.isRequired
}

export default translate(['common'])(
  MaecenatePresentation
)
