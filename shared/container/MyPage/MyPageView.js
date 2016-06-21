import React from 'react'
import YourProfileContainer from './YourProfileContainer'
import YourMaecenatesContainer from './YourMaecenatesContainer'
import YourMaecensContainer from './YourMaecensContainer'

export default function MyPageView () {
  return (
    <div>
      <YourMaecenatesContainer />
      <YourMaecensContainer />
      <YourProfileContainer />
    </div>
  )
}
