import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import db from "./db.js";
import { authenticateToken } from "./utilities.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server started successfully");
});
const PORT = process.env.DB_PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/create-account", async (req, res) => {
  try {
    console.log("🧾 Creating an account...");

    const { fullname, email, password } = req.body;

    // 1️⃣ Basic validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // 2️⃣ Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.json({ error: true, message: "Email already exists" });
    }

    // 3️⃣ Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Insert user into MySQL
    const insertQuery = `
      INSERT INTO users (fullname, email, password, otp, otp_expiry)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [
      fullname,
      email,
      hashedPassword,
      otp,
      otpExpiry,
    ]);

    console.log("✅ User inserted with ID:", result.insertId);
    console.log("6-digit OTP:", otp);
    console.log("OTP expiry:", otpExpiry);

    // 6️⃣ Send OTP via SendGrid
    await sgMail.send({
      from: "dadapir19ce30@gmail.com",
      to: [email],
      subject: "[TODO] Your OTP for Signup",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <h2 style="text-align: center; color: #2563eb; margin-bottom: 10px;">
              Welcome to <span style="color: #10b981;">TODO</span>
            </h2>
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>We received a request to sign up for a MemoBloom account using your email.</p>
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; margin: 20px 0; text-align: center; border-radius: 6px;">
              <p>Your OTP code is:</p>
              <h1 style="margin: 5px 0; font-size: 32px; letter-spacing: 3px; color: #1d4ed8;">${otp}</h1>
              <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            </div>
            <p>If you did not request this, you can safely ignore this email.</p>
            <hr/>
            <p style="text-align: center; font-size: 13px; color: #9ca3af;">
              © ${new Date().getFullYear()} TODO. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("📨 OTP email sent successfully!");

    // 7️⃣ Generate JWT token
    const accessToken = jwt.sign({ userId: result.insertId, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m", // around 25 days
    });

    // 8️⃣ Send response
    res.status(201).json({
      error: false,
      message: "User created successfully! OTP sent to email.",
      accessToken,
      user: {
        id: result.insertId,
        fullname,
        email,
        otp,
        otpExpiry,
      },
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});


//login
app.post("/login", async (req, res) => {
  try {
    console.log("[Login] API called");

    const { email, password } = req.body;

    // 1️⃣ Validate inputs
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!password) return res.status(400).json({ error: true, message: "Password is required" });

    // 2️⃣ Check if user exists
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (result.length === 0) {
      console.log("User not found");
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const user = result[0];

    // 3️⃣ Compare hashed passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ error: true, message: "Invalid email or password" });
    }

    // 4️⃣ Generate JWT
    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful for:", user.email);

    // 5️⃣ Send response
    return res.status(200).json({
      error: false,
      message: "Login successfull",
      accessToken,
      user: {
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("🔥 Login error:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



// verifying the otp
app.post("/verify-otp", async (req, res) => {
  console.log("Verifying OTP...");
  const { email, otp } = req.body;

  // 1️⃣ Check for required fields
  if (!email) return res.json({ error: true, message: "Email is required" });
  if (!otp) return res.json({ error: true, message: "otp is required" });

  try {
    // 2️⃣ Check if email exists in users table
    const [emailResult] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (emailResult.length === 0) {
      console.log("Email does not exist");
      return res.json({
        error: true,
        message: "Email does not exist/User not found",
      });
    }

    console.log("Email exists bro");

    // 3️⃣ Check if OTP matches
    const [otpResult] = await db.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (otpResult.length === 0) {
      console.log("Otp does not match");
      return res.json({ error: false, message: "Otp doesnot match" });
    }

    const otpExpiry = otpResult[0].otpExpiry;
    const now = new Date();

    // 4️⃣ Check if OTP is expired
    if (new Date(otpExpiry) < now) {
      console.log("Otp has expired");
      return res.json({ error: false, message: "OTP has expired" });
    }

    // 5️⃣ OTP verified successfully
    console.log("Otp verified successfully");
    return res.json({ error: false, message: "otp verified" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      error: true,
      message: "Server error while verifying OTP",
    });
  }
});


app.post("/add", async (req, res) => {
  try {
    console.log("[POST] /add API called");

    // Extract fields from request body
    const { title, status, description, user_id } = req.body;

    // 1️⃣ Input validation
    if (!title) {
      return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ error: true, message: "Description is required" });
    }

    if (!user_id) {
      return res.status(400).json({ error: true, message: "User ID is required" });
    }

    // 2️⃣ Insert task into MySQL
    const query =
      "INSERT INTO task (title, status, description, user_id) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [
      title,
      status || "pending",
      description,
      user_id,
    ]);

    console.log("✅ Task inserted successfully, ID:", result.insertId);

    // 3️⃣ Return response
    return res.status(201).json({
      error: false,
      message: "Task added successfully!",
      task: {
        id: result.insertId,
        title,
        description,
        status: status || "pending",
        user_id,
      },
    });
  } catch (err) {
    console.error("Error inserting task:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error while adding task",
    });
  }
});



//getting all the task
app.get("/all-task/:user_id", async (req, res) => {
  try {
    console.log("[GET] /all-task API called");

    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        error: true,
        message: "User ID is required to fetch tasks",
      });
    }

    // Join task and users table
     const query = `
      SELECT 
        t.*,       
        u.user_id,
        u.fullname,
        u.email
      FROM task t
      INNER JOIN users u 
        ON t.user_id = u.user_id
      WHERE t.user_id = ?;
    `;

    const [result] = await db.query(query, [user_id]);

    if (result.length === 0) {
      console.log("⚠️ No tasks found for this user");
      return res.status(404).json({
        error: true,
        message: "No tasks found for this user",
      });
    }

    console.log("✅ Tasks fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks: result,
    });

  } catch (err) {
    console.error("🔥 Error getting the data:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error while fetching tasks",
    });
  }
});





//deleting the task
app.delete("/del-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[DELETE] /del-task API called with ID:", id);

    if (!id) {
      return res.status(400).json({ error: true, message: "Task ID is required" });
    }

    const query = "DELETE FROM task WHERE id = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    return res.status(200).json({
      error: false,
      message: "Task deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    console.error("🔥 Error deleting task:", err);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});


//updating the status
app.put("/update-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🛠️ [UPDATE] /update-task called with ID:", id);

    // ✅ Validate ID
    if (!id) {
      return res.status(400).json({ error: true, message: "Task ID is required" });
    }

    // ✅ Fetch current task status
    const [rows] = await db.query("SELECT status FROM task WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    // ✅ Toggle the status
    const currentStatus = rows[0].status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    // ✅ Update status in DB
    const [updateResult] = await db.query(
      "UPDATE task SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: true, message: "Failed to update task" });
    }

    console.log(`✅ Task ID ${id} updated from '${currentStatus}' → '${newStatus}'`);

    // ✅ Send success response
    return res.status(200).json({
      error: false,
      message: `Task status updated successfully to '${newStatus}'`,
      updatedStatus: newStatus,
    });

  } catch (error) {
    console.error("🔥 Error updating task:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



//creating an account
app.post("/create-account", async (req, res) => {
  try {
    console.log("Creating an account...");

    const { fullname, email, password } = req.body;

    // 1️⃣ Basic validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // 2️⃣ Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.json({ error: true, message: "Email already exists" });
    }

    // 3️⃣ Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Insert user into MySQL
    const insertQuery = `
      INSERT INTO users (fullname, email, password, otp, otp_expiry)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [
      fullname,
      email,
      hashedPassword,
      otp,
      otpExpiry,
    ]);

    console.log("✅ User inserted with ID:", result.insertId);
    console.log("6-digit OTP:", otp);
    console.log("OTP expiry:", otpExpiry);

    // 6️⃣ Send OTP via SendGrid
    await sgMail.send({
      from: "dadapir19ce30@gmail.com",
      to: [email],
      subject: "[MemoBloom] Your OTP for Signup",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
            <h2 style="text-align: center; color: #2563eb; margin-bottom: 10px;">
              Welcome to <span style="color: #10b981;">MemoBloom</span> 🌸
            </h2>
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>We received a request to sign up for a MemoBloom account using your email.</p>
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; margin: 20px 0; text-align: center; border-radius: 6px;">
              <p>Your OTP code is:</p>
              <h1 style="margin: 5px 0; font-size: 32px; letter-spacing: 3px; color: #1d4ed8;">${otp}</h1>
              <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            </div>
            <p>If you did not request this, you can safely ignore this email.</p>
            <hr/>
            <p style="text-align: center; font-size: 13px; color: #9ca3af;">
              © ${new Date().getFullYear()} MemoBloom. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("📨 OTP email sent successfully!");

    // 7️⃣ Generate JWT token
    const accessToken = jwt.sign({ userId: result.insertId, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m", // around 25 days
    });

    // 8️⃣ Send response
    res.status(201).json({
      error: false,
      message: "User created successfully! OTP sent to email.",
      accessToken,
      user: {
        id: result.insertId,
        fullname,
        email,
        otp,
        otpExpiry,
      },
    });
  } catch (error) {
    console.error("🔥 Error creating account:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});



