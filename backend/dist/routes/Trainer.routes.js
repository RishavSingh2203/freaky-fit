"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const trainer_controller_1 = require("../controllers/trainer.controller");
router.get('/allTrainers', trainer_controller_1.getAllTrainers);
router.post('/bookTrainer', trainer_controller_1.bookTrainer);
router.post('/accept', trainer_controller_1.acceptSessionRequest);
router.post('/reject', trainer_controller_1.rejectSessionRequest);
// Add routes for user and trainer sessions
router.get('/sessions/:userId', trainer_controller_1.getUserSessions);
router.get('/trainer/:trainerId/sessions', trainer_controller_1.getTrainerSessions);
router.post('/cancelSession', trainer_controller_1.cancelSession);
router.post('/completeSession', trainer_controller_1.completeSession);
exports.default = router;
