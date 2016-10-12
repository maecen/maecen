
const defaultUnit = 16
const mediaSizes = {
  lg: '70em',
  md: '45em',
  sm: '30em',
  xs: '20em'
}

export default {
  animation: {
    default: '.3s ease'
  },
  border: {
    radius: '3px'
  },
  color: {
    alert: 'rgb(244, 67, 54)',
    background: 'hsl(210, 5%, 92%)',
    bodyText: 'hsl(210, 5%, 30%)',
    cardText: 'hsl(0, 0%, 13%)',
    gray: 'rgb(200,200,200)',
    headerBG: 'hsl(210, 8%, 87%)',
    icon: 'rgba(255,255,255,0.6)',
    primary: 'hsl(190, 100%, 30%)',
    white: 'white'
  },
  font: {
    size: {
      bodySmall: '12px',
      body: `${defaultUnit}px`,
      bodyLarge: '18px',
      h1: '30px',
      h1Big: '40px',
      h2: '26px',
      h2Big: '32px'
    },
    weight: {
      heading: '300',
      body: '400',
      subtitle: '500'
    },
    lineHeight: {
      body: '1.6',
      heading: '1.2'
    }
  },
  grid: {
    gutter: {
      base: `${defaultUnit}px`,
      half: `${defaultUnit / 2}px`
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
  defaults: {
    maxWidth: '70rem',
    padding: '0 0.5rem',
    margin: '0 auto'
  },
  media: {
    lg: mediaSizes.lg,
    md: mediaSizes.md,
    sm: mediaSizes.sm,
    xs: mediaSizes.xs
  },
  spacer: {
    base: `${defaultUnit}px`,
    onePointFive: `${defaultUnit * 1.5}px`,
    double: `${defaultUnit * 2}px`,
    tripple: `${defaultUnit * 3}px`,
    quadrouple: `${defaultUnit * 4}px`,
    half: `${defaultUnit / 2}px`,
    quart: `${defaultUnit / 4}px`
  },
  breakpoint: {
    lg: `@media screen and (min-width: ${mediaSizes.lg})`,
    md: `@media screen and (min-width: ${mediaSizes.md})`,
    sm: `@media screen and (min-width: ${mediaSizes.sm})`
  }
}

// transition: all 450ms cubic-bezier(.23, 1, .32, 1) 0ms;
