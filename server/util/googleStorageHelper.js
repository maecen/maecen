import simpelBufferStream from 'simple-bufferstream'
import storage from '@google-cloud/storage'

// Initiate google cloud api
const GCLOUD_PRIVATE_KEY = (process.env.GCLOUD_private_key || '')
.replace(/\\n/g, '\n')
.replace(/\\u003d/g, '=')

const gcs = storage({
  projectId: 'maecen-dk',
  credentials: {
    private_key: GCLOUD_PRIVATE_KEY,
    client_email: process.env.GCLOUD_client_email
  }
})

const bucket = gcs.bucket(process.env.GCLOUD_bucket || 'maecen')
const BUCKET_PATH = `https://${bucket.name}.storage.googleapis.com`

export function uploadStream (stream, path) {
  if (arguments.length < 2) {
    throw new Error('You have to provide at least two arguments for `uploadStream`')
  }

  return new Promise((resolve, reject) => {
    const file = bucket.file(path)
    const remoteWriteStream = file.createWriteStream()
    stream.pipe(remoteWriteStream)
    .on('finish', () => {
      file.makePublic((err, res) => {
        if (err) return reject(err)
        resolve({ secure_url: `${BUCKET_PATH}/${path}` })
      })
    })
  })
}

export function uploadBuffer (buffer, path) {
  if (arguments.length !== 2) {
    throw new Error('You have to provide two arguments for `uploadStream`')
  }
  const stream = simpelBufferStream(buffer)
  return uploadStream(stream, path)
}

export function deleteFile (url) {
  const path = url.replace(`${BUCKET_PATH}/`, '')
  console.log('deleteFile', url, path)
  return new Promise((resolve, reject) => {
    bucket.file(path).delete((err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

export function belongsToService (url) {
  return url.startsWith(BUCKET_PATH)
}
