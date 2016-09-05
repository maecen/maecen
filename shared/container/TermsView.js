import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Row, Cell } from '../components/Grid'
import { Card, CardContent } from '../components/Card'

class TermsView extends Component {

  render () {
    const { t } = this.props

    return (
      <Row>
        <Cell narrowLayout={true}>
          <Card>
            <CardContent>
              {t('termsAndConditions.title')}
              {t('termsAndConditions.content')}
            </CardContent>
          </Card>
        </Cell>
      </Row>
    )
  }
}

export default translate(['common'])(
  TermsView
)
