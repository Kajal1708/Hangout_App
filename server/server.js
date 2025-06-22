const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hangoutApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -------------------- AUTH --------------------
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send({ msg: 'User registered' });
  } catch (err) {
    res.status(400).send({ msg: 'Registration failed', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (!user) return res.status(401).send({ msg: 'Invalid credentials' });
    res.send({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).send({ msg: 'Server error', error: err.message });
  }
});

// -------------------- USERS --------------------
app.get('/users/:id', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } });
    res.send(users);
  } catch (err) {
    res.status(500).send({ msg: 'Failed to fetch users', error: err.message });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ msg: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(500).send({ msg: 'Failed to fetch user', error: err.message });
  }
});

// -------------------- CONNECTION REQUEST --------------------
app.get('/requests/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('receivedRequests', 'name email');
    if (!user) return res.status(404).send({ msg: 'User not found' });
    res.send(user.receivedRequests);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching requests', error: err.message });
  }
});

// -------------------- CONNECTION REQUEST --------------------

app.post('/send-request', async (req, res) => {
  const { from, to } = req.body;

  if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
    return res.status(400).send({ msg: 'Invalid user IDs' });
  }

  try {
    // Ensure you are using ObjectIds
    const fromId = new mongoose.Types.ObjectId(from);
    const toId = new mongoose.Types.ObjectId(to);

    // ✅ This is where you're adding the received request
    await User.findByIdAndUpdate(toId, {
      $addToSet: { receivedRequests: fromId },
    });

    // Add to sender's sentRequests
    await User.findByIdAndUpdate(fromId, {
      $addToSet: { sentRequests: toId },
    });

    res.send({ msg: 'Request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Error sending request', error: err.message });
  }
});


app.post('/accept-request', async (req, res) => {
  const { from, to } = req.body;
  if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
    return res.status(400).send({ msg: 'Invalid user IDs' });
  }
  try {
    const fromId = new mongoose.Types.ObjectId(from);
    const toId = new mongoose.Types.ObjectId(to);

    await User.findByIdAndUpdate(fromId, {
      $addToSet: { connections: toId },
      $pull: { sentRequests: toId },
    });
    await User.findByIdAndUpdate(toId, {
      $addToSet: { connections: fromId },
      $pull: { receivedRequests: fromId },
    });
    res.send({ msg: 'Request accepted' });
  } catch (err) {
    res.status(500).send({ msg: 'Error accepting request', error: err.message });
  }
});

// -------------------- CONNECTIONS --------------------
app.get('/connections/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('connections', 'name email');
    if (!user) return res.status(404).send({ msg: 'User not found' });
    res.send(user.connections);
  } catch (err) {
    res.status(500).send({ msg: 'Error getting connections', error: err.message });
  }
});

// -------------------- HANGOUT REQUEST --------------------
app.get('/hangout-requests/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('hangoutRequests.from hangoutRequests.via', 'name email');
    if (!user) return res.status(404).send({ msg: 'User not found' });
    res.send(user.hangoutRequests);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching hangout requests', error: err.message });
  }
});


app.post('/send-hangout-request', async (req, res) => {
  const { from, to, via } = req.body;
  if (![from, to, via].every(id => mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).send({ msg: 'Invalid user IDs' });
  }

  try {
    const toUser = await User.findById(to);
    if (!toUser) return res.status(404).send({ msg: 'User not found' });

    toUser.hangoutRequests.push({
      from: new mongoose.Types.ObjectId(from),
      via: new mongoose.Types.ObjectId(via),
      status: 'pending'
    });

    await toUser.save();
    res.send({ msg: 'Hangout request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Error sending hangout request', error: err.message });
  }
});

app.post('/approve-hangout-request', async (req, res) => {
  const { to, from, approver } = req.body;
  if (![to, from, approver].every(id => mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).send({ msg: 'Invalid user IDs' });
  }
  try {
    const user = await User.findById(to);
    if (!user) return res.status(404).send({ msg: 'User not found' });

    const request = user.hangoutRequests.find(
      r => r.from.toString() === from && r.via.toString() === approver
    );

    if (!request) return res.status(400).send({ msg: 'Request not found' });

    request.status = 'approved';
    await user.save();
    res.send({ msg: 'Hangout request approved' });
  } catch (err) {
    res.status(500).send({ msg: 'Error approving hangout request', error: err.message });
  }
});

// -------------------- ROOT --------------------
app.get('/', (req, res) => res.send('🎉 Hangout App Backend is Running!'));

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
