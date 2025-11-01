import { pool } from "../config/db.js";

export const getAllEvents = async (req, res) => {
    try {
        const { name, date } = req.query;

        let query = "SELECT * FROM events WHERE 1=1";
        const params = [];

        if (name) {
            params.push(`%${name}`);
            query += ` AND name ILIKE $${params.length}`;
        }

        if (date) {
            params.push(date);
            query += ` AND date = $${params.length}`;
        }

        query += " ORDER BY date ASC";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getEventsById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Evento não encontrado." })
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { name, location, date, artist } = req.body;

        if (!name || !location || !date || !artist) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
        }

        const result = await pool.query(
            "INSERT INTO events (name, location, date, artist) values ($1, $2, $3, $4) RETURNING *",
            [name, location, date, artist]
        );

        res.status(201).json({ message: "Evento criado com sucesso!", event: result.rows[0] });
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, date, artist } = req.body;

    const existing = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    const result = await pool.query(
      'UPDATE events SET name=$1, location=$2, date=$3, artist=$4 WHERE id=$5 RETURNING *',
      [name, location, date, artist, id]
    );

    res.json({ message: 'Evento atualizado com sucesso!', event: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Evento excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    res.status(500).json({ message: 'Erro ao excluir evento.' });
  }
};