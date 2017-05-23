// Imports
import React from 'react'
import { translate } from 'react-i18next'

// Utils
import { isBrowser } from '../../config'
import { slugify } from 'strman'

// Components
import { Row, Cell } from '../Grid'
import LinearProgressDeterminate from '../Progress/LinearProgress'
import Form, { TextField, Button, MarkdownField, FileDropzone } from '../Form'
import { Card, CardContent, CardTitle } from '../Card'

function MaecenateForm (props) {
  const {
    t,
    maecenate,
    handleSubmit,
    updateModel,
    errors,
    logoUploadProgress,
    coverUploadProgress,
    isSubmitting,
    coverChange,
    logoChange,
    request
  } = props

  console.log(maecenate.cover, maecenate.logo)
  const editMode = Boolean(props.editMode)

  const titleStr = editMode
    ? t('maecenate.edit', { maecenate: maecenate.title })
    : t('maecenate.create')
  const submitStr = editMode
    ? t('maecenate.update', { maecenate: maecenate.title })
    : t('maecenate.create')

  const uploadLogoStr = maecenate.logo
    ? t('maecenate.replaceLogoLabel')
    : t('maecenate.uploadLogoLabel')
const uploadCoverStr = maecenate.cover
    ? t('maecenate.replaceCoverLabel')
    : t('maecenate.uploadCoverLabel')

  const goBack = isBrowser && window.history.back.bind(window.history)

  const getUrl = (name) => {
    const { protocol, hostname } = request
    const path = name ? slugify(name.replace(/\//g, '-')) : ''
    return `${protocol}://${hostname}/${path}`
  }

  const style = {
    logoWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 1rem',
      flexGrow: '1'
    }
  }

  return (
    <Row>
      <Cell narrowLayout={true}>
        <Card>
          <CardTitle
            title={titleStr}
            style={{paddingBottom: '0px'}}
          />
          <CardContent>
            <Form
              onSubmit={handleSubmit}
              model={maecenate}
              updateModel={updateModel}
              errors={errors}>

              <div style={style.logoWrapper}>
                <FileDropzone
                  multiple={false}
                  label={uploadLogoStr}
                  accept='image/*'
                  onChange={logoChange}
                  error={errors && errors.logo_media}
                  media={maecenate.logo}
                  width='100px'
                  height='100px'
                />
              <div style={style.titleWrapper}>
                  <TextField
                    path={['title']}
                    label={t('title')}
                    multiLine={true} />
                  <TextField
                    value={getUrl(maecenate.title)}
                    label={t('maecenate.resultingUrl')}
                    multiLine={true}
                    disabled={true} />
                  <br />
                </div>


              </div>


              <LinearProgressDeterminate
                value={logoUploadProgress}
              />

              <FileDropzone
                multiple={false}
                label={uploadCoverStr}
                accept='video/*,image/*'
                onChange={coverChange}
                error={errors && errors.cover_media}
                media={maecenate.cover}
                width='100%'
                height='200px'
              />

              <LinearProgressDeterminate
                value={coverUploadProgress}
              />

              <TextField
                path={['teaser']}
                label={t('maecenate.teaser')}
                placeholder={t('maecenate.teaserPlaceholder')}
                maxLength='140' />
              <br />

              <MarkdownField
                path={['description']}
                label={t('maecenate.description')}
                placeholder={t('maecenate.descriptionPlaceholder')} />

              <TextField
                path={['url']}
                label={t('maecenate.website')}
                placeholder={t('maecenate.websitePlaceholder')} />
              <br />

              <TextField
                path={['monthly_minimum']}
                label={t('maecenate.subscriptionPrice')}
                type='number'
                min={1}
                placeholder={t('maecenate.subscriptionPricePlaceholder')} />
              <br />

              <div style={{textAlign: 'right'}}>
                <Button
                  onClick={goBack}
                  label={t('action.cancel')}
                  flat={true}
                  disabled={isSubmitting === true}
                />
                <Button type='submit'
                  style={{marginTop: '16px'}}
                  primary={true}
                  last={true}
                  label={submitStr}
                  disabled={isSubmitting} />
              </div>
            </Form>
          </CardContent>
        </Card>
      </Cell>
    </Row>
  )
}

export default translate(['common'])(MaecenateForm)
