import express from 'express';
import multer from 'multer';
import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  getFilterOptions
} from '../controllers/mentorController.js';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.get('/', getMentors);
router.get('/filters', getFilterOptions);
router.get('/:id', getMentorById);
router.post('/', upload.single('profileImage'), createMentor);
router.put('/:id', upload.single('profileImage'), updateMentor);
router.delete('/:id', deleteMentor);

export default router;