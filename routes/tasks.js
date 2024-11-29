const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const tasksFilePath = path.join(__dirname, "../data/tasks.json");

// Helper functions
const readTasks = () => JSON.parse(fs.readFileSync(tasksFilePath, "utf-8"));
const writeTasks = (tasks) => fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));

// Task counter for generating unique IDs
let taskCounter = readTasks().length;

// Task 2: Create a Task
router.post("/", (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
    }

    const newTask = {
        id: ++taskCounter,
        title,
        description,
        status: "pending",
    };

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json({
        message: "Task created successfully",
        task: newTask,
    });
});

// Task 3: Get All Tasks
router.get("/", (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Task 4: Update a Task
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'pending' or 'completed'." });
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks[taskIndex].status = status;
    writeTasks(tasks);

    res.json({
        message: "Task updated successfully",
        task: tasks[taskIndex],
    });
});

// Task 5: Delete a Task
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    res.json({ message: "Task deleted successfully" });
});

// Task 6: Filter Tasks by Status
router.get("/status/:status", (req, res) => {
    const { status } = req.params;

    if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'pending' or 'completed'." });
    }

    const tasks = readTasks();
    const filteredTasks = tasks.filter((task) => task.status === status);
    res.json(filteredTasks);
});

module.exports = router;
