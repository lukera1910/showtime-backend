import express from 'express';
import cors from 'cors';
import eventRouter from './routes/eventRouter.js';
import authRouter from './routes/authRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use('/api/events', eventRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('API rodando...');
});

export default app;