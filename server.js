const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await
const cors = require('cors'); // Install cors: npm install cors

const app = express();
app.use(cors()); // Enable CORS (Important!)
app.use(bodyParser.json());

// MySQL connection (using async/await)
async function connectToDb() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root', // Replace with your MySQL username
            password: 'root', // Replace with your MySQL password
            database: 'hotelBooking'
        });
        console.log('Connected to MySQL');
        return db;
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the process if the connection fails (important!)
    }
}

let db; // Store the database connection
(async () => { db = await connectToDb(); })(); // Establish the connection


// POST endpoint for booking (using async/await and better error handling)
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, email, checkIn, checkOut, roomType } = req.body;

        // Input validation (essential!)
        if (!name || !email || !checkIn || !checkOut || !roomType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate date format and check if checkOut is after checkIn
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Check if the dates are valid
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Check if checkOut is after checkIn
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }

        // Prepare and execute the SQL query
        const query = 'INSERT INTO bookings (name, email, check_in, check_out, room_type) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, email, checkIn, checkOut, roomType]);

        // Send success response
        res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });

    } catch (err) {
        console.error("Booking Error:", err); // Log the full error for debugging
        res.status(500).json({ error: 'Internal server error while creating booking' }); // Send a generic error message
    }
});

// GET endpoint for retrieving bookings (using async/await)
app.get('/api/bookings', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM bookings');
        res.json(results);
    } catch (err) {
        console.error("Retrieval Error:", err); // Log the error
        res.status(500).json({ error: 'Error retrieving bookings' }); // Send a generic 500 error response
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});