import React, { PropTypes } from 'react'
import HeaderContainer from '../../container/HeaderContainer'
import FooterContainer from '../../container/FooterContainer'
import s from './ContentWrapper.scss'

export default function ContentWrapper (props, context) {
  return (
    <div className={s.main}>
      <HeaderContainer />
      <div className={s.contentWrap}>
        <div className={s.content}>
          {props.children}
        </div>
      </div>
      <FooterContainer />
    </div>
  )
}

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired
}
