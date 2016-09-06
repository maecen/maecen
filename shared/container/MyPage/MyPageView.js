import React from 'react'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'
import YourMaecensContainer from './YourMaecensContainer'
import { Row, Cell } from '../../components/Grid'

export default function MyPageView () {
  return (
    <Row>
      <Cell lg={6}>
        <YourMaecenatesContainer />
        <YourMaecensContainer />
      </Cell>
      <Cell lg={6}>
        <YourProfileContainer />
      </Cell>
    </Row>
  )
}
