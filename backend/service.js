const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const dummyData = [
  {
    id: 1,
    due: "2024-04-17T14:00:00.000Z",
    priority: "Should",
    task: "Speaking",
    status: false,
    attachments: [],
  },
  {
    id: 2,
    due: "2024-04-20T14:00:00.000Z",
    priority: "Won't",
    task: "Writing",
    status: true,
    attachments: [],
  },
  {
    id: 3,
    due: "2024-04-19T14:00:00.000Z",
    priority: "Must",
    task: "Listening",
    status: true,
    attachments: [],
  },
  {
    id: 4,
    due: "2024-04-18T14:00:00.000Z",
    priority: "Should",
    task: "Reading",
    status: true,
    attachments: [],
  },
  {
    id: 5,
    due: "2024-04-20T14:00:00.000Z",
    priority: "Must",
    task: "Evaluating",
    status: true,
    attachments: [],
  },
  {
    id: 6,
    due: "2024-04-29T14:00:00.000Z",
    priority: "Could",
    task: "Have a nap",
    status: false,
    attachments: [],
  },
];

app.get("/api/items", (req, res) => {
  res.json(dummyData);
});

app.post("/api/items", (req, res) => {
  const newItem = req.body;
  if (!newItem || !newItem.task) {
    return res.status(400).json({ error: "Task is required" });
  }
  newItem.id = dummyData.length + 1;
  dummyData.push(newItem);
  res.status(201).json({ message: "Item added successfully", item: newItem });
});

app.delete("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = dummyData.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  dummyData.splice(index, 1);
  res.status(200).json({ message: "Item deleted successfully" });
});

app.put("/api/items/:id/toggle", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = dummyData.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  dummyData[itemIndex].status = !dummyData[itemIndex].status;
  res.json({
    message: "Item status toggled successfully",
    item: dummyData[itemIndex],
  });
});

app.put("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const itemIndex = dummyData.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  dummyData[itemIndex] = {
    ...dummyData[itemIndex],
    ...updatedItem,
  };
  res.json({
    message: "Item updated successfully",
    item: dummyData[itemIndex],
  });
});

app.get("/api/items/search", (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }
  const filteredItems = dummyData.filter((item) =>
    item.task.toLowerCase().includes(searchQuery.toLowerCase())
  );
  res.json(filteredItems);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
