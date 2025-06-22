// const express = require("express");
// const cors = require("cors");
// const app = express();
// app.use(cors());
// app.use(express.json());

// let users = {
//   A: { connections: ["B", "C"], pending: [], approved: [] },
//   B: { connections: ["A", "D"], pending: [], approved: [] },
//   C: { connections: ["A", "E"], pending: [], approved: [] },
//   D: { connections: ["B"], pending: [], approved: [] },
//   E: { connections: ["C"], pending: [], approved: [] },
// };

// app.get("/users/:id", (req, res) => {
//   const user = req.params.id;
//   const connections = users[user]?.connections || [];
//   const secondDegree = connections.flatMap(c => users[c]?.connections || []);
//   const unique2nd = [...new Set(secondDegree.filter(p => p !== user && !connections.includes(p)))];
//   res.json({
//     connections,
//     secondDegree: unique2nd,
//     pending: users[user]?.pending,
//     approved: users[user]?.approved,
//   });
// });

// app.post("/request", (req, res) => {
//   const { from, to } = req.body;
//   if (!users[to].pending.includes(from)) {
//     users[to].pending.push(from);
//   }
//   res.sendStatus(200);
// });

// app.post("/approve", (req, res) => {
//   const { from, to } = req.body;
//   if (users[to].pending.includes(from)) {
//     users[to].pending = users[to].pending.filter(x => x !== from);
//     users[to].approved.push(from);
//     users[from].approved.push(to);
//   }
//   res.sendStatus(200);
// });

// app.listen(3000, () => console.log("Server running on http://localhost:3000"));
