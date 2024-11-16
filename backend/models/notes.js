import mongoose from "mongoose"

const newSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Notes = mongoose.model("Notes", newSchema)
export default Notes
