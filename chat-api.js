// chat-api.js - API simple para el chat de inversores
// Backend mínimo para gestionar mensajes del chat

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'chat-messages.json');
const MAX_MESSAGES = 100;
const MAX_LENGTH = 500;

// Leer mensajes
function getMessages() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return { messages: [], lastUpdated: new Date().toISOString() };
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo chat-messages.json:', error);
        return { messages: [], lastUpdated: new Date().toISOString() };
    }
}

// Guardar mensajes
function saveMessages(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error guardando chat-messages.json:', error);
        return false;
    }
}

// Añadir mensaje
function addMessage(username, text) {
    if (!username || !text || text.trim().length === 0) {
        return { success: false, error: 'Nombre y texto requeridos' };
    }

    if (text.length > MAX_LENGTH) {
        return { success: false, error: `Mensaje demasiado largo (máx ${MAX_LENGTH} caracteres)` };
    }

    const data = getMessages();
    
    const newMessage = {
        id: Date.now().toString(),
        username: sanitizeInput(username),
        text: sanitizeInput(text),
        timestamp: new Date().toISOString()
    };

    data.messages.push(newMessage);

    // Mantener solo los últimos MAX_MESSAGES
    if (data.messages.length > MAX_MESSAGES) {
        data.messages = data.messages.slice(-MAX_MESSAGES);
    }

    saveMessages(data);
    return { success: true, message: newMessage };
}

// Sanitizar input (básico)
function sanitizeInput(str) {
    return str
        .replace(/[<>]/g, '') // Eliminar tags HTML
        .trim()
        .substring(0, MAX_LENGTH);
}

// Exportar funciones para usar desde HTTP server
module.exports = {
    getMessages,
    addMessage,
    saveMessages
};

// Si se ejecuta directamente, mostrar estado
if (require.main === module) {
    console.log('Chat API - Estado actual:');
    const data = getMessages();
    console.log(`Mensajes: ${data.messages.length}`);
    console.log('Últimos 5 mensajes:');
    data.messages.slice(-5).forEach(m => {
        console.log(`  [${new Date(m.timestamp).toLocaleString()}] ${m.username}: ${m.text}`);
    });
}
