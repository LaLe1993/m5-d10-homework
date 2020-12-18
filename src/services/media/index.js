/* WHAT WE WOULD LIKE TO ACHIEVE 
1. get all users' data on url: localhost:3001/users/ GET
2. get single user's data on url: localhost:3001/users/:id GET
3. create single user record on url: localhost:3001/users/ POST
4. modify single user's data on url: localhost:3001/users/:id PUT
5. delete single user's data on url: localhost:3001/users/:id DELETE
*/

const express = require("express") // third party module
const fs = require("fs") // core module dedicated to file system interactions
const path = require("path") // core module
const uniqid = require("uniqid") // third party module

const router = express.Router()

const mediaFilePath = path.join(__dirname, "media.json")

// 1.
router.get("/", (request, response) => {
  // (request, response)=> is the handler for this specific route

  // a) retrieve media list from a file on disk (we do not have a real database yet!) 

  // we composed the path on disk (avoid __dirname + "\\media.json")
  const fileContentAsABuffer = fs.readFileSync(mediaFilePath) // please read the file (we are getting a Buffer back)
  console.log(fileContentAsABuffer)
  const fileContent = fileContentAsABuffer.toString() // we need to translate the buffer into something human readable

  // b) send the list as a json in the response body
  response.send(JSON.parse(fileContent)) // JSON.parse converts strings into json format
})

// 2.
router.get("/:id", (request, response) => {
  // retrieve single movie from a file on disk (we do not have a real database yet!) and send it back

  // a. read the file on disk and get back an array of media
  const fileContentAsABuffer = fs.readFileSync(mediaFilePath)
  const mediaArray = JSON.parse(fileContentAsABuffer.toString())
  console.log(mediaArray)

  // b. filter out the array to retrieve the specified movie (we're gonna be using id to retrive the unique movie)
  console.log("ID: ", request.params.id)
  const movie = mediaArray.filter((movie) => movie.imdbID === request.params.id)
  console.log(movie)
  // c. send the movie back into the response
  response.send(movie)
})

// 3.
router.post("/", (request, response) => {
  console.log(request.body)
  const newMovie = { ...request.body, imdbID: uniqid() }

  // 1. read the content of the file and get back an array of media

  const fileContentAsABuffer = fs.readFileSync(mediaFilePath)
  const mediaArray = JSON.parse(fileContentAsABuffer.toString())

  // 2. adding the new Movie to the array

  mediaArray.push(newMovie)

  // 3. writing the new content into the same file

  fs.writeFileSync(mediaFilePath, JSON.stringify(mediaArray))

  // 4. responde with status 201 === "Created"

  response.status(201).send(newMovie)
})

// 4.
router.put("/:id", (request, response) => {
  // 1. read the content of the file and get back an array of media

  const fileContentAsABuffer = fs.readFileSync(mediaFilePath)
  const mediaArray = JSON.parse(fileContentAsABuffer.toString())

  // 2. filter media by excluding the one with specified id
  const filteredMediaArray = mediaArray.filter(
    (movie) => movie.imdbID !== request.params.id
  )

  // 3. adding back the movie with the modified body
  const movie = request.body // request.body is holding the new data for the specified movie
  movie.imdbID = request.params.id

  filteredMediaArray.push(movie)

  // 4. write it back into the same file

  fs.writeFileSync(mediaFilePath, JSON.stringify(filteredMediaArray))

  // 5. respond back with ok
  response.send("Ok")
})

// 5.
router.delete("/:id", (request, response) => {
  // 1. read the content of the file and get back an array of media

  const fileContentAsABuffer = fs.readFileSync(mediaFilePath)
  const mediaArray = JSON.parse(fileContentAsABuffer.toString())

  // 2. filter media by excluding the one with specified id
  const filteredMediaArray = mediaArray.filter(
    (movie) => movie.imdbID !== request.params.id
  )

  // 3. write the filterd content back into the same file

  fs.writeFileSync(mediaFilePath, JSON.stringify(filteredMediaArray))
  // 4. respond with ok

  response.send(`Movie has been deleted`)
})

module.exports = router
