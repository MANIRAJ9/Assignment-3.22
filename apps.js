const express = require('express');
const mongoose = require('mongoose');

// Set up Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Player schema
const playerSchema = new mongoose.Schema({
  name: String,
  team: String,
  position: String,
  rushingYards: Number,
  touchdownsThrown: Number,
  sacks: Number,
  fieldGoalsMade: Number,
  fieldGoalsMissed: Number,
  catchesMade: Number,
});

// Player model
const Player = mongoose.model('Player', playerSchema);

// Add player
app.post('/players', async (req, res) => {
  const { name, team, position, rushingYards, touchdownsThrown, sacks, fieldGoalsMade, fieldGoalsMissed, catchesMade } = req.body;
  const player = new Player({
    name,
    team,
    position,
    rushingYards,
    touchdownsThrown,
    sacks,
    fieldGoalsMade,
    fieldGoalsMissed,
    catchesMade,
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update player
app.put('/players/:id', async (req, res) => {
  const { name, team, position, rushingYards, touchdownsThrown, sacks, fieldGoalsMade, fieldGoalsMissed, catchesMade } = req.body;

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      {
        name,
        team,
        position,
        rushingYards,
        touchdownsThrown,
        sacks,
        fieldGoalsMade,
        fieldGoalsMissed,
        catchesMade,
      },
      { new: true }
    );
    res.json(updatedPlayer);
  } catch (err) {
    res.status(404).json({ message: 'Player not found' });
  }
});

// Delete player
app.delete('/players/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Player not found' });
  }
});

// Query: Player with the most touchdown passes
app.get('/players/most-touchdown-passes', async (req, res) => {
  try {
    const player = await Player.findOne().sort('-touchdownsThrown');
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Query: Player with the most rushing yards
app.get('/players/most-rushing-yards', async (req, res) => {
  try {
    const player = await Player.findOne().sort('-rushingYards');
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Query: Player with the least rushing yards
app.get('/players/least-rushing-yards', async (req, res) => {
  try {
    const player = await Player.findOne().sort('rushingYards');
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Query: List of players sorted from most to fewest field goals made
app.get('/players/sorted-field-goals-made', async (req, res) => {
  try {
    const players = await Player.find().sort('-fieldGoalsMade');
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Query: Player with the most number of sacks
app.get('/players/most-sacks', async (req, res) => {
  try {
    const player = await Player.findOne().sort('-sacks');
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
