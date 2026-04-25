// server.js - Servidor simple para el dashboard con chat en tiempo real
// Ejecutar con: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.CHAT_PORT || 3000;
const DASHBOARD_DIR = __dirname;
const CHAT_FILE = path.join(DASHBOARD_DIR, 'chat-messages.json');
const MAX_MESSAGES = 100;
const MAX_LENGTH = 500;

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Leer mensajes del chat
function getMessages() {
    try {
        if (!fs.existsSync(CHAT_FILE)) {
            return { messages: [], lastUpdated: new Date().toISOString() };
        }
        const data = fs.readFileSync(CHAT_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo chat-messages.json:', error);
        return { messages: [], lastUpdated: new Date().toISOString() };
    }
}

// Guardar mensajes del chat
function saveMessages(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error guardando chat-messages.json:', error);
        return false;
    }
}

// Sanitizar input
function sanitizeInput(str) {
    return str
        .replace(/[<>]/g, '')
        .trim()
        .substring(0, MAX_LENGTH);
}

// Servidor HTTP
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = path.join(DASHBOARD_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(DASHBOARD_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // API: GET /api/chat
    if (req.method === 'GET' && url.pathname === '/api/chat') {
        const data = getMessages();
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(data));
        return;
    }

    // API: POST /api/chat
    if (req.method === 'POST' && url.pathname === '/api/chat') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { username, text } = JSON.parse(body);
                
                if (!username || !text || text.trim().length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Nombre y texto requeridos' }));
                    return;
                }

                if (text.length > MAX_LENGTH) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: `Mensaje demasiado largo (máx ${MAX_LENGTH} caracteres)` }));
                    return;
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
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, message: newMessage }));
                
                console.log(`[CHAT] ${newMessage.username}: ${newMessage.text}`);
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Error procesando mensaje' }));
            }
        });
        return;
    }

    // API: OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        });
        res.end();
        return;
    }

    // Servir archivos estáticos
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(500);
                res.end('Error interno del servidor');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Dashboard de inversores con chat`);
    console.log(`   Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Chat API en http://localhost:${PORT}/api/chat`);
    console.log(`   Archivos en: ${DASHBOARD_DIR}`);
    console.log(`\n   Para detener: Ctrl+C\n`);
});
