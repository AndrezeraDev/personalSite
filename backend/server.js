require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configurar conexão com MySQL usando variáveis do .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

// Rota de cadastro
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    // Verifica se o usuário já existe
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: "E-mail já cadastrado!" });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir usuário no banco
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json({ message: "Erro ao criar usuário." });
                res.json({ message: "Cadastro realizado com sucesso!" });
            }
        );
    });
});

// Rota de login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Verifica se o usuário existe
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
        if (result.length === 0) {
            return res.status(400).json({ message: "Usuário não encontrado!" });
        }

        const user = result[0];

        // Verifica a senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Senha incorreta!" });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "1h" });

        res.json({ message: "Login realizado com sucesso!", token, redirect: "https://nanoset.com.br" });
    });
});

// Middleware de autenticação
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "Acesso negado! Faça login para continuar." });
    }

    jwt.verify(token, "secreto", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido ou expirado!" });
        }
        req.user = decoded;
        next();
    });
};

// Protegendo a rota do chat
app.get("/chat", verifyToken, (req, res) => {
    res.sendFile(__dirname + "/chat.html");
});

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                max_tokens: 550,
                temperature: 0.5
            })
        });

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error("Erro na API:", error);
        res.status(500).json({ error: "Erro ao processar a requisição." });
    }
});


// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
