// Import dependencies
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud-node'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create Express app
const app = express();

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors()); 

// Define routes

// Create a new record
app.post('/api/records', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO records (name, email) VALUES (?, ?)';
    connection.query(sql, [name, email], (err, result) => {
      if (err) {
        console.error('Error creating record:', err);
        res.status(500).json({ error: 'Error creating record' });
      } else {
        res.status(201).json({ message: 'Record created successfully' });
      }
    });
});

// Get all records
app.get('/api/records', (req, res) => {
    const sql = 'SELECT * FROM records';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({ error: 'Error fetching records' });
      } else {
        res.status(200).json(results);
      }
    });
});

app.get('/',(req,res)=>{
  console.log("calling");
});
// Get a single record by ID
app.get('/api/records/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM records WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching record:', err);
        res.status(500).json({ error: 'Error fetching record' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
});

// update a record
app.put('/api/records/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = 'UPDATE records SET name = ?, email = ? WHERE id = ?';
    connection.query(sql, [name, email, id], (err, result) => {
      if (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: 'Error updating record' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json({ message: 'Record Update Successfully'});
      }
    });
});

// Delete a record
app.delete('/api/records/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'Delete FROM  records WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: 'Error deleting record' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json({ message: 'Record deleted Successfully'});
      }
    });
});
// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
