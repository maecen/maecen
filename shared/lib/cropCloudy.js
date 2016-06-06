export default function (url, type) {
  if (typeof url === 'undefined') {
    return url
  }

  let glue = ''
  const urlSplitted = url.split('upload')

  if (type === 'cover') {
    glue = 'upload/w_1200,h_675,c_fill'
  } else if (type === 'logo') {
    glue = 'upload/w_250,h_250,c_fill'
  } else if (type === 'post') {
    glue = 'upload/w_600'
  } else {
    glue = 'upload'
  }
  return urlSplitted[0] + glue + urlSplitted[1]
}
