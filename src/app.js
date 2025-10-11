import express from 'express';
import cors from 'cors';
import eventRouter from './routes/eventRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use('/api/events', eventRouter);

app.get('/', (req, res) => {
    res.send('API rodando...');
});

export default app;