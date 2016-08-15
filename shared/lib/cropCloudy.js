export default function (url, type) {
  if (typeof url === 'undefined') {
    return url
  }

  let glue = ''
  const urlSplitted = url.split('upload')

  switch (type) {
    case 'cover':
      glue = 'upload/w_1200,h_675,c_fill'
      break
    case 'logo':
      glue = 'upload/w_250,h_250,c_fill'
      break
    case 'logo-tiny':
      glue = 'upload/w_80,h_80,c_fill'
      break
    case 'post':
      glue = 'upload/w_600'
      break
    default:
      glue = 'upload'
  }

  // Change the file ending to jpg
  const path = urlSplitted[1].replace(/\.\w{2,5}$/i, '.jpg')

  return urlSplitted[0] + glue + path
}
