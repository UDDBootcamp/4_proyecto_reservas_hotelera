import express from 'express';
import dotenv from 'dotenv';
import reservasRoutes from './routes/reservasRoutes.js';
import { swaggerDocs } from './swagger/swagger.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);

app.use('/api/reservas', reservasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bien, servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
