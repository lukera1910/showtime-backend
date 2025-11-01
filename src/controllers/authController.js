import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// gerar token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
};

// cadastro de usuário
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // verifica se o usuário já existe
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Usuário já cadastrado." });
        }

        // criptografa a senha
        const hashPassword = await bcrypt.hash(password, 10);

        // insere no banco
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashPassword]
        );

        const token = generateToken(newUser.rows[0]);

        res.status(201).json({
            message: "Usuário já cadastrado com sucesso!",
            user: newUser.rows[0],
            token,
        });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// login 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length == 0) {
            return res.status(400).json({ message: "Senha incorreta." })
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        const token = generateToken(user);

        res.json({
            message: "Login realizado com sucesso!",
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};