import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";


export const register = async (req, res) => {
  const { username, password, name, role } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "username & password are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, role
      `,
      [username, hashed, name, role || 'user']
    );

    res.status(201).json({
      message: "User registered",
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "username & password are required" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, username, password, role FROM users WHERE username = $1`,
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } 
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } 
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  let token = req.body?.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    
    res.json({ accessToken });
  } catch (err) {
    
    console.error("Refresh Token Error:", err.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};