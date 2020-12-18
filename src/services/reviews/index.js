const express = require("express") // third party module
const path = require("path") // core module
const uniqid = require("uniqid") // third party module
const fs = require("fs-extra")
const { readDB, writeDB } = require("../../utilities")

const router = express.Router()


const reviewsFilePath = path.join(__dirname, "reviews.json")

console.log(reviewsFilePath)

router.get("/", (request, response) => {
    const fileContentAsABuffer = fs.readFileSync(reviewsFilePath)
    console.log(fileContentAsABuffer)
    const fileContent = fileContentAsABuffer.toString()

    response.send(JSON.parse(fileContent))
})

router.get("/:id", (request, response) => {

    const fileContentAsABuffer = fs.readFileSync(reviewsFilePath)
    const reviewsArray = JSON.parse(fileContentAsABuffer.toString())
    console.log(reviewsArray)

    const review = reviewsArray.find((review) => review._id === request.params.id )
    console.log(review)

    response.send(review)
  })

  router.post("/", (request, response) => {
    let fullUrl = request.originalUrl.slice(7,);
    let slashPosition = fullUrl.search("/")
    let movieID= fullUrl.slice(0,slashPosition)
    const newReview = { ...request.body, _id: uniqid() , movieID}
  
    const fileContentAsABuffer = fs.readFileSync(reviewsFilePath)
    const reviewsArray = JSON.parse(fileContentAsABuffer.toString())
  
    reviewsArray.push(newReview)

    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviewsArray))

    response.status(201).send(newReview)
  })

//   router.put("/:id", (request, response) => {
  
//     const fileContentAsABuffer = fs.readFileSync(reviewsFilePath)
//     const reviewsArray = JSON.parse(fileContentAsABuffer.toString())

//     const filteredReviewsArray = reviewsArray.filter(
//       (review) => review.imdbID !== request.params.id
//     )

//     const review = request.body
//     review._id = request.params.id
  
//     filteredReviewsArray.push(review)
  
//     fs.writeFileSync(reviewsFilePath, JSON.stringify(filteredReviewsArray))
  
//     response.send("Ok")
//   })

  router.put("/:id", async (req, res, next) => {
    try {
        console.log(reviewsFilePath)
      const reviews = await readDB(reviewsJsonPath)
      const review = reviews.find((b) => b._id === req.params.id)
      if (review) {
        const position = reviews.indexOf(review)
        const reviewUpdated = { ...review, ...req.body } // In this way we can also implement the "patch" endpoint
        reviews[position] = reviewUpdated
        await writeDB(reviewsJsonPath, reviews)
        res.status(200).send("Updated")
      } else {
        const error = new Error(`Book with asin ${req.params.asin} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:id", (request, response) => {

    const fileContentAsABuffer = fs.readFileSync(reviewsFilePath)
    const reviewsArray = JSON.parse(fileContentAsABuffer.toString())
  
    const filteredReviewsArray = reviewsArray.filter(
      (review) => review._id !== request.params.id
    )

    fs.writeFileSync(reviewsFilePath, JSON.stringify(filteredReviewsArray))
  
    response.send(`Review has been deleted`)
  })


module.exports = router