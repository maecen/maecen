import React from 'react'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'
import YourMaecensContainer from './YourMaecensContainer'

export default function MyPageView () {
  return (
    <ContentWrapper>
      <YourMaecenatesContainer />
      <YourMaecensContainer />
      <YourProfileContainer />
    </ContentWrapper>
  )
}
