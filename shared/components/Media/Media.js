import React, { PropTypes } from 'react'
import { startsWith } from 'strman'
import cropCloudy from '../../lib/cropCloudy'
import s from './Media.scss'

export default function Media (props, context) {
  if (props.fixAspect) {
    return (
      <div className={s.cover}>
        {props.url && startsWith(props.type, 'video')
          ? <video className={`${s.coverMedia} ${s.coverVideo}`} src={props.url} controls />
          : <img className={s.coverMedia} src={cropCloudy(props.url, 'cover')} />
        }
      </div>
    )
  } else {
    return (
      <div>
        { startsWith(props.type, 'video')
          ? <video width='100%' src={props.url} controls />
          : <img src={cropCloudy(props.url, 'post')} width='100%' />
        }
      </div>
    )
  }
}

Media.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fixAspect: PropTypes.bool
}

Media.defaultProps = {
  fixAspect: 'false'
}
