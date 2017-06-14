import React, { Component } from 'react'
import Radium from 'radium';
import i18n from 'react-i18next';
import { Row, Cell } from '../components/Grid';
import styleVariables from '../components/styleVariables';

const HomeInfo = (props, context) => {
  const lang = context.i18n.language
  const content = context.i18n.store.data[lang].frontpage

  if(!content || !content.band || !content.masonry) return null

  let blocks = content.band.map(Block)
  let collumns = content.masonry.map(Collumn)

  return (
    <div style={style.container}>
      <Row style={style.band}> {blocks} </Row>
      <Row style={style.masonry}> {collumns} </Row>
    </div>
  )
}

const Block = ({title, description}, key) => {
  return (
    <Cell key={key} style={style.block} md={4}>
      <h2 style={style.heading}>{title}</h2>
      <p style={style.paragraph}>{description}</p>
    </Cell>
  )
}

const Collumn = (blocks, key) => {
  let items = blocks.map(({title, description}, i) => {
    return (
      <div key={i} style={style.block}>
        <h2 style={style.heading}>{title}</h2>
        <p style={style.paragraph}>{description}</p>
      </div>
    )
  })

  return (<Cell key={key} md={4}>{items}</Cell>)
}

const style = {
  container: {
    width: '100%'
  },
  masonry: {
    marginTop: '2rem'
  },
  band: {
    backgroundColor: styleVariables.color.primary,
    color: styleVariables.color.white,
    marginTop: '5rem',
  },
  block: {
    textAlign: 'left',
    padding: '1rem 2rem',
    lineHeight: '1.5rem',
  },
  heading: {
    textTransform: 'uppercase'
  },
  paragraph: {
    marginTop: '1rem',
  }
}

HomeInfo.contextTypes = {
  i18n: React.PropTypes.object.isRequired
}

export default HomeInfo;
