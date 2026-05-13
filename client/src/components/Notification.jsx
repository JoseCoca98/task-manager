function Notification({ message, type }) {
    if (!message) return null

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }

    return (
        <div className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
        </div>
    )
}

export default Notification