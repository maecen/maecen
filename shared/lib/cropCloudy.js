export default function (url, type) {
  var glue = ''
  var urlSplitted = url.split('upload')

  if (type === 'cover') {
    glue = 'upload/w_1200,h_675,c_fill'
  } else if (type === 'logo') {
    glue = 'upload/w_250,h_250,c_fill'
  } else {
    glue = 'upload'
  }
  return urlSplitted[0] + glue + urlSplitted[1]
}
