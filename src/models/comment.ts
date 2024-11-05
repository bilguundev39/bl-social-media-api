import mongoose, { Document, Schema } from 'mongoose'

interface IComment extends Document {
  postId: mongoose.Types.ObjectId
  content: string
  creator: mongoose.Types.ObjectId
  createdAt: Date
}

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'posts', required: true },
  content: { type: Schema.Types.String, required: true },
  creator: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Schema.Types.Date, required: true }
})

export const Comment = mongoose.model<IComment>('comments', commentSchema)
