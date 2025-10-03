// src/index.ts
import 'dotenv/config';
import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

const app = createApp();

// Aseguramos número
const PORT = Number(ENV.PORT || 4000);

const server = app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});

// Conecta a Mongo SIN bloquear el arranque del servidor
connectDB()
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('⚠️ No se pudo conectar a MongoDB. La API sigue arriba para /health.', err);
  });

// Cierre ordenado (CTRL+C)
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  server.close(() => {
    console.log('🛑 Servidor cerrado');
    process.exit(0);
  });
});
