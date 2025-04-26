import { Express } from "express";
import { Router } from "express";
const router= Router();
import { protect } from "../middlewares/auth.middleware";
import { 
  acceptSessionRequest, 
  bookTrainer, 
  cancelSession, 
  completeSession,
  getAllTrainers, 
  getUserSessions,
  getTrainerSessions,
  rejectSessionRequest 
} from "../controllers/trainer.controller";

// Public endpoint to get all trainers - no auth required
router.get('/allTrainers', getAllTrainers);
router.post('/bookTrainer',bookTrainer);
router.post('/accept',acceptSessionRequest);
router.post('/reject',rejectSessionRequest);

// Add routes for user and trainer sessions
router.get('/sessions/:userId', getUserSessions);
router.get('/trainer/:trainerId/sessions', getTrainerSessions);
router.post('/cancelSession', cancelSession);
router.post('/completeSession', completeSession);

export default router;