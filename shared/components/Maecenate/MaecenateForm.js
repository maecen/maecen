import React, { Component } from 'react'
import { connect } from 'react-redux'
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
            label={t('maecenate.uploadLogoLabel')}
            accept='image/*'
            onChange={logoChange}
            error={errors && errors.logo_media}
          />

          <LinearProgressDeterminate
            value={logoUploadProgress}
          />

          <FileDropzone
            multiple={false}
            label={t('maecenate.uploadCoverLabel')}
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

          <Button type='submit'
            style={{marginTop: '16px'}}
            primary={true}
            label={submitStr}
            disabled={isSubmitting} />
        </Form>
      </CardContent>
    </Card>
  )
}

export default translate(['common'])(MaecenateForm)
