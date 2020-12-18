const express = require("express") // import express from 'express'
const mediaRoutes = require("./services/media")
const reviewsRoutes = require("./services/reviews")
// const cors = require("cors")

const server = express()

// server.use(cors())

server.use(express.json()) // parse the bodies when they are in json format

server.use("/media", mediaRoutes)
server.use("/media/:id/reviews", reviewsRoutes)


server.listen(3001, () => {
  console.log("Server is running on port 3001")
})
