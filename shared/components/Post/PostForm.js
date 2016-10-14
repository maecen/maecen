// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

// Utils
import { postStatus } from '../../config'

// Components
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { Row, Cell } from '../../components/Grid'
import { Card, CardContent, CardTitle, CardActions } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'
import LinearProgressDeterminate from '../../components/Progress/LinearProgress'
import FileDropzone from '../../components/Form/FileDropzone'

function PostForm (props) {
  const {
    maecenates,
    post,
    handleSubmit,
    updateModel,
    errors,
    onChangeMaecenate,
    mediaChange,
    fileChange,
    fileUploadProgress,
    mediaUploadProgress,
    isSubmitting,
    toggleVisible,
    t
  } = props

  const hasMedia = Boolean(post.media && post.media.length)
  const hasFile = Boolean(post.file)

  const editMode = Boolean(props.editMode)
  const titleStr = editMode ? t('post.edit') : t('post.create')
  const submitStr = editMode ? t('post.saveEdit') : t('post.create')
  const mediaStr = hasMedia ? t('media.replace') : t('media.upload')

  const fileStr = hasFile
    ? t('post.attachmentReplace')
    : t('post.attachmentUpload')

  return (
    <Row>
      <Cell narrowLayout={true}>
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
                value={mediaUploadProgress} />

              <FileDropzone
                multiple={false}
                label={fileStr}
                accept='*'
                onChange={fileChange} />

              <LinearProgressDeterminate
                value={fileUploadProgress} />

              <TextField
                path={['content']}
                placeholder={t('post.content')}
                multiLine={true} />

              <TextField
                path={['author_alias']}
                placeholder={t('user.alias')} />

              <Checkbox
                label={t('post.setVisible')}
                onCheck={toggleVisible}
                defaultChecked={post.status === postStatus.PUBLISHED}
              />

            </CardContent>
            <CardActions style={{textAlign: 'right'}}>
              <Button
                type='submit'
                label={submitStr}
                primary={true}
                disabled={isSubmitting === true} />
            </CardActions>
          </Form>
        </Card>
      </Cell>
    </Row>
  )
}

PostForm.propTypes = {
  maecenates: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  post: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  updateModel: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onChangeMaecenate: PropTypes.func,
  mediaChange: PropTypes.func.isRequired,
  fileChange: PropTypes.func.isRequired,
  mediaUploadProgress: PropTypes.number.isRequired,
  fileUploadProgress: PropTypes.number.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  toggleVisible: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default translate(['common'])(
  PostForm
)
