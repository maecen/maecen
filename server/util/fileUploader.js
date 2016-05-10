import simpelBufferStream from 'simple-bufferstream'
import cloudinary from 'cloudinary'

export function uploadBuffer (buffer, path) {
  if (arguments.length !== 2) {
    throw new Error('You have to provide two arguments for `uploadStream`')
  }

  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((result) => {
      if (result.error) {
        return reject(result.error.message)
      } else {
        return resolve(result)
      }
    }, {
      public_id: path
    })

    simpelBufferStream(buffer).pipe(writeStream)
  })
}

export function uploadDataUri (dataUri, path) {
  const data = dataUri.replace(/^data:image\/png;base64,/, '')
  const buffer = new Buffer(data, 'base64')
  return uploadBuffer(buffer, path)
}
