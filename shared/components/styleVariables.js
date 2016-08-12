
const defaultUnit = 16

export default {
  animation: {
    default: '.3s ease'
  },
  border: {
    radius: '3px'
  },
  color: {
    alert: 'rgb(244, 67, 54)',
    bodyText: 'white',
    icon: 'rgba(255,255,255,0.6)',
    gray: 'rgb(200,200,200)',
    primary: 'hsl(190, 100%, 30%)'
  },
  font: {
    size: {
      bodySmall: '12px',
      body: `${defaultUnit}px`,
      bodyLarge: '18px',
      h1: '30px',
      h1Big: '40px'
    },
    weight: {
      heading: '300',
      subtitle: '500'
    },
    lineHeight: {
      body: '1.6',
      heading: '1.2'
    }
  },
  icon: {
    size: {
      sm: '20px',
      md: '30px',
      lg: '40px',
      xl: '60px'
    }
  },
  media: {
    lg: '70rem'
  },
  spacer: {
    base: `${defaultUnit}px`,
    onePointFive: `${defaultUnit * 1.5}px`,
    double: `${defaultUnit * 2}px`,
    half: `${defaultUnit / 2}px`,
    quart: `${defaultUnit / 4}px`
  }
}

// transition: all 450ms cubic-bezier(.23, 1, .32, 1) 0ms;
