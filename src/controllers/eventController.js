import { pool } from "../config/db.js";

export const getAllEvents = async (req, res) => {
    try {
        const { 
          name,
          artist,
          location,
          dateFrom,
          dateTo,
          status, // cancelado / ativo
          orderBy = 'date',
          orderDir = 'asc',
          page = 1,
          limit = 20,
        } = req.query;

        let query = "SELECT * FROM events WHERE 1=1";
        let countQuery = 'SELECT COUNT(*) FROM events WHERE 1=1';
        const params = [];

        if (name) {
            params.push(`%${name}%`);
            query += ` AND name ILIKE $${params.length}`;
            countQuery += ` AND name ILIKE $${params.length}`;
        }

        if (artist) {
            params.push(`%${artist}%`);
            query += ` AND artist ILIKE $${params.length}`;
            countQuery += ` AND artist ILIKE $${params.length}`;
        }

        if (location) {
          params.push(`%${location}%`);
          query += ` AND location ILIKE $${params.length}`;
          countQuery += ` AND location ILIKE $${params.length}`;
        }

        if (dateFrom) {
          params.push(dateFrom);
          query += ` AND date >= $${params.length}`;
          countQuery += ` AND date >= $${params.length}`;
        }

        if (dateTo) {
          params.push(dateTo);
          query += ` AND date <= $${params.length}`;
          countQuery += ` AND date <= $${params.length}`;
        }

        if (status) {
          // só se você criar coluna status na tabela
          params.push(status);
          query += ` AND status = $${params.length}`;
          countQuery += ` AND status = $${params.length}`;
        }

        // ordenação
        const validOrderBy = ['date', 'name', 'artist', 'location', 'created_at'];
        const validOrderDir = ['asc', 'desc'];

        const orderColumn = validOrderBy.includes(orderBy) ? orderBy : 'date';
        const orderDirection = validOrderDir.includes(orderDir.toLowerCase())
          ? orderDir.toUpperCase()
          : 'ASC';

        query += ` ORDER BY ${orderColumn} ${orderDirection}`;

        // paginação
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 20;
        const offset = (pageNumber - 1) * limitNumber;

        query += ` LIMIT ${limitNumber} OFFSET ${offset}`;

        // executa as duas queries
        const [dataResult, countResult] = await Promise.all([
          pool.query(query, params),
          pool.query(countQuery, params),
        ]);

        const total = Number(countResult.rows[0].count);

        res.json({
          total,
          page: pageNumber,
          limit: limitNumber,
          data: dataResult.rows,
        });
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