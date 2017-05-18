import React, { PropTypes, Component } from 'react'
import Immutable from 'seamless-immutable'
import marked from 'marked'
import { translate } from 'react-i18next'

import { Tabs, Tab } from 'material-ui/Tabs'

import MaterialTextField from 'material-ui/TextField'
import { grey300, grey400, pink500 } from 'material-ui/styles/colors'

import TextField from './TextField'
import Button from './Button'
import Link from '../../components/Link'

class MarkdownField extends Component {
  state = { writing: true, focus: false }

  static propTypes = {
    path: React.PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    placeholder: PropTypes.string
  }

  static contextTypes = {
    updateValue: PropTypes.func,
    model: PropTypes.object,
    errors: PropTypes.object
  }

  toggleWriting = () => {
    this.setState(prevState => ({
      writing: !prevState.writing,
      focus: false}
    ))
  }

  onFocusHandler = () => {
    this.setState({focus: true})
  }

  onBlurHandler = () => {
    this.setState({focus: false})
  }

  render() {
    const { writing, focus } = this.state
    const { t } = this.props;

    const textColor = focus ? pink500 : grey400

    return (
      <div style={style.container}>
        <div style={style.topbar}>
          <span style={{color:textColor}}>{this.props.label}</span>
          <div style={style.buttons}>
            <Button
              label={t('action.edit')}
              style={style.button}
              flat={true}
              onClick={this.toggleWriting}
              disabled={writing} />
            <Button
              label={t('action.preview')}
              style={style.button}
              flat={true}
              onClick={this.toggleWriting}
              disabled={!writing} />
          </div>

        </div>
        {
          writing ?
            <div>
              <TextField
                name={this.props.label}
                onFocus={this.onFocusHandler}
                onBlur={this.onBlurHandler}
                rowsMax={12}
                path={this.props.path}
                multiLine={true} />
              <span style={style.helpText}>
                {t('markdown.helpText')}
                <Link
                  to="https://guides.github.com/features/mastering-markdown/"
                  target='_blank'
                >
                  {t('markdown.linkText')}
                </Link>
              </span>
            </div>
          :
            <MarkdownPreview path={this.props.path}/>
        }


      </div>
    )
  }
}

const MarkdownPreview = ({ path }, { model }) => {
  function createMarkup() {
    const value = model[path] || '';

    return { __html: marked(value, { sanitize: true })}
  }

  return (
    <div style={style.preview} dangerouslySetInnerHTML={createMarkup()}></div>
  )
}

MarkdownPreview.contextTypes = {
  model: PropTypes.object
}


const style = {
  container: {
    margin: '2rem 0 .5rem',
    width: 'auto',
    padding: '1rem .75rem',
    border: '1px solid',
    borderColor: grey300,
    overflowX: 'auto'
  },
  topbar: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  buttons: {
    display: 'flex',
    marginLeft: 'auto',
  },
  preview: {
    marginTop: '16px'
  },
  helpText: {
    color: grey400,
    fontSize: '0.8rem'
  }
}

export default translate(['common'])(MarkdownField)
