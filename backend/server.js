import express, { request, response } from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import mongoose, { isValidObjectId } from "mongoose"
import jwt from "jsonwebtoken"

import LoginSchema from "./models/loginSchema.js"
import Notes from "./models/notes.js"

const app = express()
app.use(express.json())
app.use(cors())

app.post("/", async (request, response) => {
  try {
    const notes = request.body
    const data = await Notes.create(notes)
    response.status(201).json({ data: data })
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
})

app.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body

    const user = await LoginSchema.findOne({ email })

    if (!user) {
      return response.status(404).json({ message: "user not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return response.status(400).json({ message: "invalid password" })
    }
    const payLoad = { userId: user._id, email: email }
    const secret_Key = "Vijay"
    const token = jwt.sign(payLoad, secret_Key, { expiresIn: "2h" })
    response.status(200).json({ jwt_token: token, user })
  } catch (error) {
    response.status(500).json({ message: "Server Error", error: error.message })
  }
})

app.get("/", async (request, response) => {
  try {
    const data = await Notes.find()
    response.status(200).json({ data: data })
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
})

app.post("/signup", async (request, response) => {
  try {
    const { email, password } = request.body
    const existingUser = await LoginSchema.findOne({ email })
    if (existingUser) {
      return response.status(400).json({ message: "User Already Exist" })
    }
    const hashedPassowrd = await bcrypt.hash(password, 10)
    const newUser = new LoginSchema({
      email,
      password: hashedPassowrd,
    })
    await newUser.save()
    response.status(201).send({ message: "User Rigistered Succesfully" })
  } catch (error) {
    response.status(500).json({ message: "Server Error: ", error })
  }
})

app.delete("/:id", async (request, response) => {
  try {
    const note = await Notes.deleteOne({ _id: request.params.id })
    console.log(note)

    response.status(200).json({ message: "Success" })
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
})

mongoose
  .connect(
    "mongodb+srv://vijay:vijay@cluster0.ovxzc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(4000, () => {
      console.log("DB Connected & Server Running at 4000")
    })
  })
  .catch((error) => {
    console.log("MongoDB Error: ", error)
  })
