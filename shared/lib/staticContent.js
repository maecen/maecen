import axios from 'axios'
import marked from 'marked'
import { localesURL } from '../config'

const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  const size = (4 - level) * 0.4
  const style = `
    font-size: ${1 + size}rem;
    margin: 0.5em 0 0;
  `
  return `<h${level} style='${style}'>${text}</h${level}>`
}

renderer.paragraph = (text) => {
  const style = `
    margin: 0 0 1em 0;
  `
  return `<p style='${style}'>${text}</p>`
}

marked.setOptions({
  renderer
})

export default function fetchStaticContent (language, content) {
  return axios(`${localesURL}/${language}/${content}.md`)
  .then(result => marked(result.data))
}
