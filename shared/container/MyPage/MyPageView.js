import React from 'react'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'
import YourMaecensContainer from './YourMaecensContainer'
import { Row, Cell } from '../../components/Grid'

export default function MyPageView () {
  return (
    <Row>
      <Cell lg='1/2'>
        <YourMaecenatesContainer />
        <YourMaecensContainer />
      </Cell>
      <Cell lg='1/2'>
        <YourProfileContainer />
      </Cell>
    </Row>
  )
}
