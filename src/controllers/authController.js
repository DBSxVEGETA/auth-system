const bcrypt = require("bcryptjs");
const { pool } = require("../db/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const showRegisterPage = (req, res) => {
  res.render("register", { error: null });
};

const listUsers = async (req, res) => {
  const result = await pool.query("SELECT username, email FROM users");
  res.json(result.rows);
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render("register", { error: "Please provide all the details" });
  }
  if (!email.includes("@") || password.length < 8) {
    return res.render("register", { error: "Invalid email or password too short" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);

    if (existing.rows.length > 0) {
      return res.render("register", { error: "Username or email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, hashed]);

    res.send("Registered! <a href='/login'>Login here</a>");
  } catch (error) {
    console.error(error);
    res.render("register", { error: "Server error. Try again." });
  }
};

const showloginPage = (req, res) => {
  res.render("login", { siteKey: process.env.RECAPTCHA_SITE_KEY, error: null });
};

const loginUser = async (req, res) => {
  const { identifier, password, "g-recaptcha-response": captcha } = req.body;

  if (!identifier || !password) {
    return res.render("login", { error: "Please provide all the details", siteKey: process.env.RECAPTCHA_SITE_KEY });
  }

  if (!captcha) {
    return res.render("login", {
      error: "Please complete the reCAPTCHA.",
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }

  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;

    const response = await axios.post(verifyURL, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captcha,
      },
    });

    if (!response.data.success) {
      return res.render("login", {
        error: "Invalid reCAPTCHA. Please try again.",
        siteKey: process.env.RECAPTCHA_SITE_KEY,
      });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $1", [identifier]);

    console.log(userResult.rows[0]);

    const user = userResult.rows[0];
    if (!user) return res.render("login", { error: "User not found", siteKey: process.env.RECAPTCHA_SITE_KEY });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: "Invalid credentials", siteKey: process.env.RECAPTCHA_SITE_KEY });

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    console.log(token);

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.render("login", { error: "Login error. Try again.", siteKey: process.env.RECAPTCHA_SITE_KEY });
  }
};

const getProfile = async (req, res) => {
  const token = req.cookies.token || req.headers["authorization"];
  if (!token) return res.redirect("/login?error=unauthorized");

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const expiryTime = userData.exp * 1000;
    console.log(expiryTime);
    const userRes = await pool.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [userData.id]);
    const user = userRes.rows[0];
    if (!user) return res.redirect("/login?error=unauthorized");

    res.render("profile", { user, expiryTime });
  } catch (err) {
    console.error(err);
    res.redirect("/login?error=expired");
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

module.exports = { showRegisterPage, listUsers, registerUser, showloginPage, loginUser, getProfile, logoutUser };
