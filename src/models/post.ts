import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId
  caption: string
  body: string
  creator: mongoose.Types.ObjectId
  createdAt: Date
  comments: mongoose.Types.ObjectId[]
  commentCounts: number
}

const postSchema = new Schema({
  caption: { type: Schema.Types.String, required: true },
  body: { type: Schema.Types.String, required: true },
  creator: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Schema.Types.Date, required: true },
  comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'comments' }],
  commentCounts: { type: Schema.Types.Number, required: true } // this field should be indexed
})

export const Post = mongoose.model<IPost>('posts', postSchema)
