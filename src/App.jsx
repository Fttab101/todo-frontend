import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Componente hijo: TaskList
function TaskList({ tasks }) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="p-2 border rounded">
          <span className={task.completed ? 'line-through' : ''}>
            {task.title} {task.location ? `(${task.location.lat}, ${task.location.lng})` : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Componente principal: App
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // URL de la API
  const apiUrl = 'https://todo-backend-qx2x.onrender.com/tasks';

  // Obtener tareas
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(apiUrl);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error al obtener tareas:', err);
      }
    };
    fetchTasks();
  }, []);

  // Añadir tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
  
    const newTaskData = {
      title: newTask,
      completed: false,
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
    };
  
    try {
      await axios.post(apiUrl, newTaskData);
      const response = await axios.get(apiUrl); // Refresca las tareas
      setTasks(response.data);
      setNewTask('');
      setLat('');
      setLng('');
    } catch (err) {
      setError(err.message);
      console.error('Error al crear tarea:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitud (opcional)"
          className="border p-2 w-full mb-2"
          step="any"
        />
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitud (opcional)"
          className="border p-2 w-full mb-2"
          step="any"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Añadir
        </button>
      </form>

      {loading && <p>Cargando tareas...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <p>No hay tareas aún</p>
      )}
      {!loading && !error && tasks.length > 0 && (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}

export default App;