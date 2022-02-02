import { Router } from 'express';
import * as userControllers from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js'

const router = Router();

router
  .route('/')
  .post(userControllers.registerUser)
  .get(protect, userControllers.getAllUsers);

router
  .route('/login')
  .post(userControllers.loginUser);

router
  .route('/profile')
  .get(protect, userControllers.getUserProfile);

router
  .route('/referal')
  .post(protect, userControllers.increaseUserEarning);

export default router;