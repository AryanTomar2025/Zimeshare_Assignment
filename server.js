import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const dbUri = process.env.MONGODB_URI;


mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const clothingSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
});

const Clothing = mongoose.model('Clothing', clothingSchema);


app.get('/api/clothes', async (req, res) => {
  const searchQuery = req.query.q;
  if (searchQuery && searchQuery.length > 3) {
    const results = await Clothing.find({
      name: new RegExp(searchQuery, 'i'),
    });
    res.json(results);
  } else {
    res.json([]);
  }
});


app.post('/api/clothes', async (req, res) => {
  const newClothing = new Clothing({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });

  try {
    const savedClothing = await newClothing.save();
    res.status(201).json(savedClothing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
