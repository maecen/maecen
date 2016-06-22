import React from 'react'
import { translate } from 'react-i18next'

import { Row, Col } from 'react-flexbox-grid/lib'
import { Card, CardContent, CardTitle, CardActions } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'
import LinearProgressDeterminate from '../../components/Progress/LinearProgress'
import FileDropzone from '../../components/Form/FileDropzone'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

function PostForm (props) {
  const {
    maecenates,
    post,
    handleSubmit,
    updateModel,
    errors,
    onChangeMaecenate,
    mediaChange,
    uploadProgress,
    isSubmitting,
    t
  } = props

  const hasMedia = Boolean(post.media && post.media.length)

  const editMode = Boolean(props.editMode)
  const titleStr = editMode ? t('post.edit') : t('post.create')
  const submitStr = editMode ? t('post.edit') : t('post.create')
  const mediaStr = hasMedia ? t('media.replace') : t('media.upload')

  return (
    <Row>
      <Col smOffset={3} sm={6} xs={12}>
        <Card>
          <CardTitle title={titleStr} />
          <Form onSubmit={handleSubmit} model={post}
            updateModel={updateModel} errors={errors}>
            <CardContent>

              {Boolean(maecenates) === true &&
                <SelectField
                  onChange={onChangeMaecenate}
                  value={post.maecenate}
                  floatingLabelText={t('post.maecenate')} >
                  {maecenates.map((maecenate, i) => (
                    <MenuItem
                      value={maecenate.id}
                      key={maecenate.id}
                      primaryText={maecenate.title}
                    />
                  ))}
                </SelectField>
              }

              <TextField
                path={['title']}
                placeholder={t('post.title')} />

              <FileDropzone
                multiple={false}
                label={mediaStr}
                accept='video/*,image/*'
                onChange={mediaChange} />

              <LinearProgressDeterminate
                value={uploadProgress} />

              <TextField
                path={['content']}
                placeholder={t('post.content')}
                multiLine={true} />

              <TextField
                path={['author_alias']}
                placeholder={t('user.alias')} />

            </CardContent>
            <CardActions>
              <Button
                type='submit'
                label={submitStr}
                primary={true}
                disabled={isSubmitting === true} />
            </CardActions>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default translate(['common'])(
  PostForm
)
