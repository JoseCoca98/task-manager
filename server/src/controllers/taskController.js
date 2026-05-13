const prisma = require('../prismaClient')

const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.userId }
        })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

const createTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.userId
            }
        })
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params
    const { title, description, status, priority, dueDate } = req.body

    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        })

        if (!task || task.userId !== req.userId) {
            return res.status(404).json({ message: 'Tarea no encontrada' })
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null }
        })

        res.json(updatedTask)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params

    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        })

        if (!task || task.userId !== req.userId) {
            return res.status(404).json({ message: 'Tarea no encontrada' })
        }

        await prisma.task.delete({
            where: { id: parseInt(id) }
        })

        res.json({ message: 'Tarea eliminada correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }