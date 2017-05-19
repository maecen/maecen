import styleVariables from '../styleVariables'
const { spacer, font, color, border, defaults, avatar } = styleVariables

export default {
  mainContainer: {
    width: '100%'
  },
  cardContainer: {
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent,
    boxSizing: 'border-box'
  },
  description: {
    padding: `${spacer.base} 0px`,
    lineHeight: '1.2'
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: defaults.maxWidthContent,
    padding: `${spacer.double} ${spacer.base}`,
    boxSizing: 'border-box'
  },
  line: {
    borderBottom: `${styleVariables.border.thickness} solid ${styleVariables.color.background}`,
    marginBottom: spacer.base,
    transform: `translate(0, -${spacer.base})`
  },
  avatar: {
    borderRadius: avatar.radius,
    marginRight: spacer.base
  },
  avatarSize: avatar.size,
  editIcon: {
    marginRight: '0px',
    position: 'absolute',
    top: '0px',
    right: '0px'
  },
  header: {
    position: 'absolute',
    right: '0px',
    top: spacer.double
  },
  closedMessage: {
    fontWeight: font.weight.subtitle,
    textAlign: 'center'
  },
  subtitle: {
    fontWeight: font.weight.subtitle,
    marginBottom: spacer.base
  },
  url: {
    marginTop: spacer.base
  },
  link: {
    color: color.primary,
    textDecoration: 'none'
  },
  supportWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderTop: `${border.thickness} solid ${color.background}`,
    paddingTop: spacer.double,
    paddingBottom: spacer.base
  },
  button: {
    flexShrink: '0',
    marginLeft: 'auto'
  }
}
