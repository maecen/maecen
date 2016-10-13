import axios from 'axios'

export function fileUpload (files, opts) {
  return upload('files', '/api/files/upload', files, opts)
}

export function mediaUpload (files, opts) {
  return upload('media', '/api/files/upload-media', files, opts)
}

/**
 * @param opts: { setState, uploadProgressProp }
 **/

function upload (plural, uploadUrl, files, opts) {
  const uploadProgressProp = opts.uploadProgressProp || 'uploadProgress'
  const setState = opts.setState

  setState({ isSubmitting: true, [uploadProgressProp]: 0 })

  return new Promise((resolve, reject) => {
    let formData = new window.FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append(`${plural}[${i}]`, files[i])
    }

    const config = {
      progress: (e) => {
        setState({
          [uploadProgressProp]: (e.loaded / e.total).toFixed(4) * 90
        })
      }
    }

    axios.post(uploadUrl, formData, config)
    .then(res => res.data)
    .then(data => {
      setState({
        errors: null,
        isSubmitting: false,
        [uploadProgressProp]: 100.0
      })
      resolve(data)
    }).catch((res) => {
      setState({ errors: null, isSubmitting: false })
      setState({ errors: res.data.errors })
      reject(res)
    })
  })
}
