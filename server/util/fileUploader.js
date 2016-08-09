import simpelBufferStream from 'simple-bufferstream'
import cloudinary from 'cloudinary'

export function uploadStream (stream, path, type) {
  if (arguments.length < 2) {
    throw new Error('You have to provide at least two arguments for `uploadStream`')
  }

  // I'm aware it's a bad place to put it, but we need some sort of intercepter
  // for the testing environment as we can't have everything be uploaded when
  // we test, it's gonna be expensive
  if (process.env.NODE_ENV === 'testing') {
    return Promise.resolve({
      secure_url: 'https://fakeurl.com'
    })
  } else {
    return new Promise((resolve, reject) => {
      const writeStream = cloudinary.uploader.upload_stream((result) => {
        if (result.error) {
          return reject(result.error.message)
        } else {
          return resolve(result)
        }
      }, {
        public_id: path,
        resource_type: type || 'image'
      })

      stream.pipe(writeStream)
    })
  }
}

export function uploadBuffer (buffer, path) {
  if (arguments.length !== 2) {
    throw new Error('You have to provide two arguments for `uploadStream`')
  }
  const stream = simpelBufferStream(buffer)
  return uploadStream(stream, path)
}

export function uploadDataUri (dataUri, path) {
  const data = dataUri.replace(/^data:image\/(png|jpeg);base64,/, '')
  const buffer = new Buffer(data, 'base64')
  return uploadBuffer(buffer, path)
}

export function deleteFile (imageUrl) {
  const m = imageUrl.match(/\/v\d+\/(.+)?\.\S{3,5}$/)
  const publicId = m[1]
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (result) => {
      if (result.error) {
        return reject(result.error.message)
      } else {
        return resolve(result)
      }
    }, { invalidate: true })
    resolve()
  })
}
