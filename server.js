import express from "express";
import dotenv from "dotenv";
import reservasRoutes from "./routes/reservasRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
    
app.use("./api/reservas", reservasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bien, servidor corriendo en http://localhost:${PORT}`);
});
