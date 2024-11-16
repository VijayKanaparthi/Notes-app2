import mongoose from "mongoose"

const newSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
const LoginSchema = mongoose.model("LoginSchema", newSchema)

export default LoginSchema
