import React, { PropTypes } from 'react'
import { startsWith } from 'strman'
import cropCloudy from '../../lib/cropCloudy'

const style = {
  cover: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden'
  },
  coverMedia: {
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    width: '100%'
  },
  coverVideo: {
    backgroundColor: 'black'
  }
}

export default function Media (props, context) {
  if (props.fixedRatio) {
    return (
      <div style={style.cover}>
        {props.url && startsWith(props.type, 'video')
          ? <video style={`${style.coverMedia} ${style.coverVideo}`} src={props.url} controls />
          : <img style={style.coverMedia} src={cropCloudy(props.url, 'cover')} />
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
  fixedRatio: PropTypes.bool
}

Media.defaultProps = {
  fixedRatio: false
}
