const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger-output.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');
require('dotenv').config();

var router = express.Router();
router.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'ntugetherdb'
});

// Connect to the database
connection.connect();
console.log("connected");

// GET routes
router.get("/", getMember);
router.get("/emailSend", emailSend);
router.get("/signin", signIn);

// POST routes
router.post("/signup", signUp);

// PUT routes
router.put("/", updateMember);
router.put("/emailVerify", emailVerify);

// DELETE routes
router.delete("/", deleteMember);


const SECRET_KEY = 'sdm_is_so_fun';

function generateVerificationCode(email) {
  const timestamp = Math.floor(Math.floor(Date.now() / 1000) / 600) // Current time in seconds
  const hash = crypto.createHmac('sha256', SECRET_KEY)
                     .update(email + timestamp)
                     .digest('hex');
  const code = hash.substring(0, 6); // Take first 6 characters for simplicity
  return { code, timestamp };
}

async function signUp(req, res) {
  try {
    const { name, email, password } = req.query;
    console.log("email", email);
    console.log("name", name);
    console.log("password", password);

      try {

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user
        // SQL query to insert a new member into the database
        const sqlCreate = `INSERT INTO Users (name, email, password) VALUES (?, ?, ?);`;

        // Execute SQL query
        connection.query(sqlCreate, [name, email, hashedPassword], (error, results) => {
          if (error) {
            return res.status(500).send('Internal Server Error');
          }

          const userId = results.insertId;
          console.log(userId);
          
          // Create json web token
          const token = jwt.sign(
            {
              userId: userId,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN, // JWT_EXPIRES_IN is the duration of the token
            },
          );

          

          return res.status(201).json({
            message: 'Member created successfully',
            token: token,
          });
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


// Example route for handling forget password request
async function emailSend (req, res) {
  const {userEmail} = req.query;
  const { code, timestamp } = generateVerificationCode(userEmail);
  console.log(userEmail);
  // Check if user already exists
  const sqlCheckExistence = 'SELECT * FROM Users WHERE `email` = ?;';

  connection.query(sqlCheckExistence, [userEmail], async (error, results) => {
    if (error) {
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log("User already exists");
      return res.status(400).json({ error: "User already exists" });
    }
  });
    
  // Example email sending code with nodemailer
  const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
    auth: {
      user: process.env.Email,
      pass: process.env.Password
    }
  });

  const mailOptions = {
    from: process.env.Email,
    to: userEmail,
    subject: 'NTUgether Password Reset',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    } else {
      res.send('Verification code sent to your email. Please verify within 10 minutes.');
      // return res.status(200).json(verificationCode);
    }
  });
};

function emailVerify (req, res) {
  const { email, code } = req.body;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Re-generate the code based on the current timestamp and compare
  const { code: validCode, timestamp } = generateVerificationCode(email);
  console.log(validCode, timestamp);
  console.log(code, currentTimestamp);
  if (code === validCode ) { 
      const query = 'UPDATE Users SET verified = TRUE WHERE email = ?';
      connection.query(query, [email], (error, results) => {
          if (error) {
              return res.status(500).send('Error updating user verification status');
          }
          res.send('Email verified successfully');
      });
  } else {
      res.status(401).send('Invalid or expired verification code');
  }

}

async function signIn(req, res) {
  try {
    const { email, password } = req.query; // Extracting email and password from request query
    console.log("email", email);
    console.log("password", password);

    // SQL query to check if the user exists and get their hashed password
    const sqlCheckExistenceAndFetchPassword = 'SELECT user_id, password FROM Users WHERE `email` = ? LIMIT 1;';

    // Execute SQL query
    connection.query(sqlCheckExistenceAndFetchPassword, [email], async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length === 0) {
        // If no user found with that email
        console.log("User does not exist");
        return res.status(404).json({ error: "User does not exist" });
      }
      console.log(results);
      const { id: userId, password: hashedPassword } = results[0];

      try {
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
          // Passwords do not match
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Passwords match, create JWT token
        const token = jwt.sign(
          {
            userId: userId,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN, // Use the same JWT expiry as in signUp
          },
        );

        // Successfully authenticated
        return res.status(200).json({
          message: 'Authentication successful',
          jwtToken: token,
        });

      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error during authentication" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}





function getMember(req, res) {
  const {name, email} = req.query; 
  console.log("name", name);

  const sql = 
  `SELECT DISTINCT u.user_id, u.name, u.email
  FROM Users as u
  WHERE u.name = ?
  AND u.email = ?;
  `;
  
  // Execute SQL query
  connection.query(sql, [name, email], (error, results) => {

    if (error) {
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {

      res.json({ members: results });
    } else {
      res.status(200).send('No members found.');
    }
  });
}

function updateMember(req, res) {
  const { user_id, name, email } = req.body; // Assuming these are the fields you want to update

  // SQL query to update an existing member in the database
  const sql = `UPDATE Users SET name = ?, email = ? WHERE user_id = ?;`;

  // Execute SQL query
  connection.query(sql, [name, email, user_id], (error, results) => {
      if (error) {
          res.status(500).send('Internal Server Error');
          return;
      }
      if (results.affectedRows > 0) {
          res.status(200).send('Member updated successfully');
      } else {
          res.status(404).send('Member not found');
      }
  });
}

function deleteMember(req, res) {
  const { id } = req.body; // Get the id of the member to delete

  // SQL query to delete a member from the database
  const sql = `DELETE FROM Users WHERE user_id = ?;`;

  // Execute SQL query
  connection.query(sql, [id], (error, results) => {
      if (error) {
          res.status(500).send('Internal Server Error');
          return;
      }
      if (results.affectedRows > 0) {
          res.status(200).send('Member deleted successfully');
      } else {
          res.status(404).send('Member not found');
      }
  });
}

module.exports = router;