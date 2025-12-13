import express from 'express'
import upload from '../middleware/multer.js'
import uploadImageController from '../controllers/uploadImageController.js'

const uploadRouter = express.Router()

uploadRouter.post("/upload",upload.single('image'),uploadImageController)
export default uploadRouter