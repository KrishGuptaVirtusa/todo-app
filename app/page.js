
"use client";

import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskSummary from "../components/TaskSummary";
import TaskFilters from "../components/TaskFilters";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Load saved tasks
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("todo-tasks");

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch {
      console.log("Unable to load tasks");
    }

    setLoaded(true);
  }, []);

  // Save tasks
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("todo-tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingId !== null) {
      setTasks(tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              title: title.trim(),
              description: description.trim(),
              priority,
              dueDate,
            }
          : task
      ));
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    resetForm();
  }

  function handleEdit(task) {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setEditingId(task.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  }

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="container">
      <header className="header">
        <h1>My To-Do List</h1>
        <p>Plan your work.</p>
      </header>

      <TaskSummary
        total={total}
        pending={pending}
        completed={completed}
      />

      <TaskForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        editingId={editingId}
        onSave={handleSubmit}
        onCancel={resetForm}
      />

      <section className="tasks-section">
        <h2>My Tasks</h2>

        <TaskFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        <TaskList
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={toggleTask}
        />
      </section>
    </main>
  );
}
