import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import mapValues from 'lodash/mapValues'

// Filter out the immutable side values of the store
const toJs = store => mapValues(store, sub =>
  sub.asMutable
    ? sub.asMutable({deep: true})
    : sub
)

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-w'
    defaultIsVisible={false}
  >
    <LogMonitor select={toJs} />
  </DockMonitor>
)
