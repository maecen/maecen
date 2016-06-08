import React, { PropTypes } from 'react'
import HeaderContainer from '../../container/HeaderContainer'
import FooterContainer from '../../container/FooterContainer'
import { Grid } from 'react-flexbox-grid/lib'
import s from './ContentWrapper.scss'

export default function ContentWrapper (props, context) {
  return (
    <div className={s.main}>
      <Grid className={s.header}>
        <HeaderContainer />
      </Grid>
      <div className={s.mainContent}>
        <Grid>
          {props.children}
        </Grid>
      </div>
      <FooterContainer />
    </div>
  )
}

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired
}
