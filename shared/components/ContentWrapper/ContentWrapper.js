import React, { PropTypes } from 'react'
import HeaderContainer from '../../container/HeaderContainer'
import FooterContainer from '../../container/FooterContainer'
import s from './ContentWrapper.scss'

export default function ContentWrapper (props, context) {
  return (
    <div className={s.main}>
      <HeaderContainer />
      <div className={s.mainContent}>
        {props.children}
      </div>
      <FooterContainer />
    </div>
  )
}

ContentWrapper.propTypes = {
  children: PropTypes.object.isRequired
}

