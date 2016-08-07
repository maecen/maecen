import React from 'react'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'
import YourMaecensContainer from './YourMaecensContainer'
import { Row, Col } from 'react-flexbox-grid/lib'

export default function MyPageView () {
  return (
    <Row>
      <Col md={6} sm={12} xs={12}>
        <YourMaecenatesContainer />
        <YourMaecensContainer />
      </Col>
      <Col md={6} sm={12} xs={12}>
        <YourProfileContainer />
      </Col>
    </Row>
  )
}
