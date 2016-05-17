import mongoose from 'mongoose'
import { promisifyAll } from 'bluebird'
import { slugify } from 'strman'
const Schema = mongoose.Schema

const maecenateSchema = new Schema({
  title: { type: 'String', required: [true, 'The Maecenate needs a title'] },
  slug: { type: 'String', required: true },
  logoUrl: { type: 'String', required: [true, 'You need to add a logo'] },
  coverUrl: { type: 'String', required: [true, 'You need to add a cover'] },
  // category: { type: 'String', required: [true, 'You need to pick a category'] },
  teaser: { type: 'String', required: [true, 'You need to write a teaser'] },
  description: { type: 'String', required: [true, 'You need to write a description'] },
  url: { type: 'String' },
  dateAdded: { type: 'Date', default: Date.now }
})

maecenateSchema.path('teaser').validate((value) => {
  return value.length >= 10 && value.length <= 140
}, 'The teaser has to be between 10 and 140 characters')

maecenateSchema.path('description').validate((value) => {
  return value.length >= 30
}, 'The description has to be at least 30 characters')

// We set the slug pre validate
maecenateSchema.pre('validate', function (next) {
  let maecenate = this
  if (maecenate.isModified('title') === true) {
    maecenate.slug = slugify(maecenate.title)
  }
  next()
})

const Maecenate = promisifyAll(mongoose.model('Maecenate', maecenateSchema))
export default Maecenate

Maecenate.schema.path('title').validate(function (title, res) {
  if (this.isModified('title') === false) {
    return res(true)
  }

  const slug = slugify(title)

  Maecenate.findOne({ slug }, '_id').then(maecenate => {
    if (maecenate) {
      res(false)
    } else {
      res(true)
    }
  }, function () { res(false) })
}, 'A Maecenate with this title already exists')
