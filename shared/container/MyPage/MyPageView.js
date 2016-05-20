import React from 'react'
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import ProfileContainer from './ProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'

export default function MyPageView () {
  return (
    <ContentWrapper>
      <YourMaecenatesContainer />
      <ProfileContainer />
    </ContentWrapper>
  )
}

export default MyPageView
