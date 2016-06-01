import axios from 'axios'

export function mediaUpload (files, opts) {
  const uploadProgressProp = opts.uploadProgressProp || 'uploadProgress'
  const setState = opts.setState

  setState({ isSubmitting: true })

  return new Promise((resolve, reject) => {
    let formData = new window.FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append(`media[${i}]`, files[i])
    }

    const config = {
      progress: (e) => {
        setState({
          [uploadProgressProp]: (e.loaded / e.total).toFixed(4) * 90
        })
      }
    }

    axios.post('/api/uploadMedia', formData, config)
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

