import React from 'react'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'

export default function MyPageView () {
  return (
    <ContentWrapper>
      <YourMaecenatesContainer />
      <YourProfileContainer />
    </ContentWrapper>
  )
}

export default MyPageView
