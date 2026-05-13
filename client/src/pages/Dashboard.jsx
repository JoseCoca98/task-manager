import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState({ status: 'ALL', priority: 'ALL' })
    const [editingTask, setEditingTask] = useState(null)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks')
            setTasks(response.data)
        } catch (err) {
            setError('Error al cargar las tareas')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/tasks', newTask)
            setTasks([...tasks, response.data])
            setNewTask({ title: '', description: '', priority: 'MEDIUM' })
            setShowForm(false)
        } catch (err) {
            setError('Error al crear la tarea')
        }
    }

    const handleStatusChange = async (task) => {
        const nextStatus = {
            PENDING: 'IN_PROGRESS',
            IN_PROGRESS: 'COMPLETED',
            COMPLETED: 'PENDING'
        }
        try {
            const response = await api.put(`/tasks/${task.id}`, {
                ...task,
                status: nextStatus[task.status]
            })
            setTasks(tasks.map(t => t.id === task.id ? response.data : t))
        } catch (err) {
            setError('Error al actualizar la tarea')
        }
    }

    const handleDeleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`)
            setTasks(tasks.filter(t => t.id !== id))
        } catch (err) {
            setError('Error al eliminar la tarea')
        }
    }

    const handleEditTask = async (e) => {
        e.preventDefault()
        try {
            const response = await api.put(`/tasks/${editingTask.id}`, editingTask)
            setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t))
            setEditingTask(null)
        } catch (err) {
            setError('Error al editar la tarea')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const statusLabel = {
        PENDING: 'Pendiente',
        IN_PROGRESS: 'En progreso',
        COMPLETED: 'Completada'
    }

    const statusColor = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800'
    }

    const priorityColor = {
        LOW: 'bg-gray-100 text-gray-800',
        MEDIUM: 'bg-orange-100 text-orange-800',
        HIGH: 'bg-red-100 text-red-800'
    }

    const filteredTasks = tasks.filter(task => {
        const statusMatch = filters.status === 'ALL' || task.status === filters.status
        const priorityMatch = filters.priority === 'ALL' || task.priority === filters.priority
        return statusMatch && priorityMatch
    })

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">📝 Task Manager</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-500">
                            {tasks.filter(t => t.status === 'PENDING').length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">
                            {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">En progreso</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">
                            {tasks.filter(t => t.status === 'COMPLETED').length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completadas</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto py-8 px-4">
                {error && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4">{error}</div>
                )}

                {/* Botón nueva tarea */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mis tareas</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? 'Cancelar' : '+ Nueva tarea'}
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex gap-3 mb-6">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                        <option value="ALL">Todos los estados</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_PROGRESS">En progreso</option>
                        <option value="COMPLETED">Completada</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                        <option value="ALL">Todas las prioridades</option>
                        <option value="LOW">Baja</option>
                        <option value="MEDIUM">Media</option>
                        <option value="HIGH">Alta</option>
                    </select>
                </div>

                {/* Formulario nueva tarea */}
                {showForm && (
                    <form onSubmit={handleCreateTask} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Título</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows="3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Prioridad</label>
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="LOW">Baja</option>
                                <option value="MEDIUM">Media</option>
                                <option value="HIGH">Alta</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Fecha límite (opcional)</label>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Crear tarea
                        </button>
                    </form>
                )}

                {/* Formulario edición */}
                {editingTask && (
                    <form onSubmit={handleEditTask} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Editando tarea</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Título</label>
                            <input
                                type="text"
                                value={editingTask.title}
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                            <textarea
                                value={editingTask.description || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows="3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Prioridad</label>
                            <select
                                value={editingTask.priority}
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="LOW">Baja</option>
                                <option value="MEDIUM">Media</option>
                                <option value="HIGH">Alta</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Fecha límite</label>
                            <input
                                type="date"
                                value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingTask(null)}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Lista de tareas */}
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Cargando tareas...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No tienes tareas aún. ¡Crea una!</p>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{task.description}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColor[task.status]}`}>
                                                {statusLabel[task.status]}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        {task.dueDate && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                📅 {new Date(task.dueDate).toLocaleDateString('es-ES')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingTask(task)}
                                            className="text-sm text-green-500 hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(task)}
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            Cambiar estado
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard