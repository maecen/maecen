
const defaultUnit = 16

export default {
  color: {
    alert: 'rgb(244, 67, 54)',
    bodyText: 'white'
  },
  font: {
    size: {
      bodySmall: '12px',
      body: `${defaultUnit}px`,
      bodyDesktop: '18px'
    }
  },
  icon: {
    size: {
      big: '40px'
    }
  },
  layout: {
    wrap: '4vw 0 6vw'
  },
  media: {
    lg: '70rem'
  },
  spacer: {
    base: `${defaultUnit}px`,
    double: `${defaultUnit * 2}px`,
    half: `${defaultUnit / 2}px`
  }
}

// transition: all 450ms cubic-bezier(.23, 1, .32, 1) 0ms;
