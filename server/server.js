const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const mysql = require("mysql");
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

//Route for LoginPage.js to query with user's credentials
app.post("/login", (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }

    const sql = "SELECT * FROM user WHERE Email = ?";
    db.query(sql, [Email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }

        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Compare the hashed password
        bcrypt.compare(Password, data[0].Password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ error: "Error verifying password." });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            return res.status(200).json({ user: data[0] });
        });
    });
});

app.post("/check-key", (req, res) => {
    const { recoveryKey } = req.body;

    if (!recoveryKey) {
        return res.status(400).json({ error: "Recovery key is required." });
    }

    // Query to check if the recovery key already exists in the database
    const sql = "SELECT * FROM user WHERE recoveryKey = ?";
    db.query(sql, [recoveryKey], (err, data) => {
        if (err) {
            console.error("Error checking recovery key:", err);
            return res.status(500).json({ error: "Database error." });
        }

        // If the recovery key already exists in the database
        if (data.length > 0) {
            return res.status(200).json({ unique: false, message: "Recovery key is already in use." });
        }

        // If the recovery key does not exist in the database
        return res.status(200).json({ unique: true, message: "Recovery key is unique." });
    });
});

app.post("/recover-by-key", (req, res) => {
    const { recoveryKey } = req.body;

    if (!recoveryKey) {
        return res.status(400).json({ error: "Recovery key is required." });
    }

    // Query to find the user by recovery key
    const sql = "SELECT * FROM user WHERE recoveryKey = ?";
    db.query(sql, [recoveryKey], (err, data) => {
        if (err) {
            console.error("Error checking recovery key:", err);
            return res.status(500).json({ error: "Database error." });
        }

        if (data.length > 0) {
            return res.status(200).json({
                found: true,
                email: data[0].Email,
                password: decodePass, // Avoid returning passwords in real-world scenarios
            });
        } else {
            return res.status(404).json({ found: false, error: "No account found with this recovery key." });
        }
    });
});

app.post("/recover-by-email", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    // Query to find the user by email
    const sql = "SELECT * FROM user WHERE Email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Database error." });
        }

        if (data.length > 0) {
            return res.status(200).json({
                found: true,
                securityQuestion: data[0].securityQuestion, // Send back security question for verification
                SecurityAnswer: data[0].SecurityAnswer
            });
        } else {
            return res.status(404).json({ found: false, error: "No account found with this email." });
        }
    });
});

//this route is for CreateUser.js. It is used when the "New User?" link is selected on the login page
app.post("/create", async (req, res) => {
    const { Name, Email, Password, OrganizationName, SecurityQuestion, SecurityAnswer, RecoveryKey } = req.body;
    console.log(Name +Email+Password+OrganizationName+SecurityQuestion+SecurityAnswer+RecoveryKey);
    if (!Name || !Email || !Password || !OrganizationName || !SecurityQuestion || !SecurityAnswer || !RecoveryKey) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the recovery key is already taken
    const checkRecoveryKeySQL = "SELECT * FROM user WHERE recoveryKey = ?";
    db.query(checkRecoveryKeySQL, [RecoveryKey], (err, data) => {
        if (err) {
            console.error("Error checking recovery key:", err);
            return res.status(500).json({ error: "Error checking recovery key." });
        }

        if (data.length > 0) {
            return res.status(400).json({ error: "Recovery key already in use." });
        }

        // If recovery key is unique, hash the password and proceed to insert user data
        bcrypt.hash(Password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ error: "Error hashing password." });
            }

            const sql = "INSERT INTO user (`Name`,`Email`,`Password`,`OrganizationName`,`securityQuestion`,`securityAnswer`,`recoveryKey`) VALUES (?, ?, ?, ?, ?, ?, ?)";
            db.query(sql, [Name, Email, hashedPassword, OrganizationName, SecurityQuestion, SecurityAnswer, RecoveryKey], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error." });
                }
                return res.status(201).json({ result });
            });
        });
    });
});

app.put("/update/:id", (req, res) => {
    const sql = "UPDATE user SET `Name`=?, `Email`=?, `Password`=?, `OrganizationName`=? WHERE ID=?";
    const { Name, Email, Password, OrganizationName } = req.body;
    const id = req.params.id;

    if (!Name || !Email || !Password || !OrganizationName) {
        return res.status(400).json({ error: "Name, Email, Password, and Organization Name are required." });
    }

    db.query(sql, [Name, Email, Password, OrganizationName, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }
        return res.status(200).json({ result });
    });
});

app.delete("/user/:id", (req, res) => {
    const sql = "DELETE FROM user WHERE ID=?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error." });
        }
        return res.status(200).json({ result });
    });
});

app.post('/api/tasks', (req, res) => {
    const { userId, taskName, taskDate } = req.body;

    if (!userId || !taskName || !taskDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO calendarTasks (taskDescription, taskDate, userID) VALUES (?, ?, ?)';

    db.query(query, [taskName, taskDate, userId], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ message: 'Error adding task to the database' });
        }

        res.status(200).json({
            message: 'Task added successfully',
            taskId: result.insertId, // Return the ID of the newly inserted task
        });
    });
});

app.get('/api/tasks/:userID', (req, res) => {
    const userID = req.params.userID;

    // Query to fetch tasks for the given userId
    const sql = 'SELECT * FROM calendarTasks WHERE userID = ?';
    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks from the database' });
        }

        res.status(200).json({ tasks: result });
    });
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});