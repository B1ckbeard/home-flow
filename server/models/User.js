import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    objects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Object'
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.model('User', UserSchema)
