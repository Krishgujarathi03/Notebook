import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fetchUser from "../middleware/fetchUser.js";
const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.send(req.send);
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Email validation
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    // Find unique user with email
    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ error: "User already exists" });
    }

    // Generate Salt
    const salt = await bcrypt.genSalt(10);
    // Hashed password
    const hashedPassword = await bcrypt.hash(password, salt);
    // Save Data into database
    const newUser = User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    console.log(newUser);
    res.status(201).json({ success: "Signup Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Email validation
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    // Find unique user with email
    const user = await User.findOne({ email });

    // If user doesn't exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Matching user password to hash password
    const doMatch = await bcrypt.compare(password, user.password);

    // If match password then generate token
    if (doMatch) {
      const token = jwt.sign({ userId: user.id }, "" + process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).json({ token, success: "Login Successful" });
    } else {
      res
        .status(400)
        .json({ error: "Please enter correct email and password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getuserId", userId);
    const user = await User.findById(userId).select("-password");
    res.send(user);
    console.log("getuser", user);
  } catch (error) {
    console.log(error);
    res.status(500).send("There is something wrong");
  }
});

export default router;
