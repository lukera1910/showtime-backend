import express from 'express';
import { 
    getAllEvents,
    getEventsById,
    createEvent,
    updateEvent,
    deleteEvent 
} from '../controllers/eventController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// rotas públicas
router.get('/', getAllEvents);
router.get('/:id', getEventsById);

// rotas protegidas
router.post('/', verifyToken, createEvent);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);

export default router;