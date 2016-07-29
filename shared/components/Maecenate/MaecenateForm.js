import React from 'react'
import { translate } from 'react-i18next'

import LinearProgressDeterminate from '../../components/Progress/LinearProgress'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'
import FileDropzone from '../../components/Form/FileDropzone'
import { Card, CardContent, CardTitle } from '../../components/Card'

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
    logoChange
  } = props

  const editMode = Boolean(props.editMode)

  const titleStr = editMode
    ? t('maecenate.edit', { maecenate: maecenate.title })
    : t('maecenate.create')
  const submitStr = editMode
    ? t('maecenate.update', { maecenate: maecenate.title })
    : t('maecenate.create')

  const uploadLogoStr = maecenate.logo_media
    ? t('maecenate.replaceLogoLabel')
    : t('maecenate.uploadLogoLabel')
  const uploadCoverStr = maecenate.cover_media
    ? t('maecenate.replaceCoverLabel')
    : t('maecenate.uploadCoverLabel')

  return (
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

          <TextField
            path={['title']}
            label={t('title')} />
          <br />

          <FileDropzone
            multiple={false}
            label={uploadLogoStr}
            accept='image/*'
            onChange={logoChange}
            error={errors && errors.logo_media}
          />

          <LinearProgressDeterminate
            value={logoUploadProgress}
          />

          <FileDropzone
            multiple={false}
            label={uploadCoverStr}
            accept='video/*,image/*'
            onChange={coverChange}
            error={errors && errors.cover_media}
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

          <TextField
            path={['description']}
            label={t('maecenate.description')}
            placeholder={t('maecenate.descriptionPlaceholder')}
            multiLine={true} />
          <br />

          <TextField
            path={['url']}
            label={t('maecenate.website')}
            placeholder={t('maecenate.websitePlaceholder')} />
          <br />

          <TextField
            path={['monthly_minimum']}
            label={t('maecenate.subscriptionPrice')}
            placeholder={t('maecenate.subscriptionPricePlaceholder')} />
          <br />

          <div style={{textAlign: 'right'}}>
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
  )
}

export default translate(['common'])(MaecenateForm)
