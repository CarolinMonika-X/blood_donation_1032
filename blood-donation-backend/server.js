const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://carolin_db_user:Carolinmonika5@cluster0.gmd5n6f.mongodb.net/test?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log('Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

// Donor model
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  contact: { type: String, required: true },
  city: { type: String, required: true }
}, { timestamps: true });

const Donor = mongoose.model('Donor', donorSchema);

// Routes
app.get('/api/donors', async (req, res) => {
  try {
    console.log('📥 GET /api/donors - Fetching all donors');
    const donors = await Donor.find();
    console.log(`Found ${donors.length} donors`);
    res.json(donors);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donors', async (req, res) => {
  try {
    console.log('📤 POST /api/donors - Adding new donor:', req.body);
    const donor = new Donor(req.body);
    await donor.save();
    console.log('✅ Donor saved successfully:', donor);
    res.json(donor);
  } catch (err) {
    console.error('❌ Error saving donor:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/donors/:id', async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/donors/' + req.params.id);
    await Donor.findByIdAndDelete(req.params.id);
    console.log('✅ Donor deleted successfully');
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('❌ Error deleting donor:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Blood Donation API is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/donors`);
});
