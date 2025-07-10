import {Router} from "express";
import {
  obtenerReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  filtrarPorCliente,
  filtrarPorFecha,
  filtrarPorHotel,
  ordenarPorFecha,
  obtenerActivas,
  obtenerCanceladas,
} from "../controllers/reservasController.js";

const router = Router();

router.get("/", obtenerReservas);
router.post("/", crearReserva);
router.put("/:id", actualizarReserva);
router.delete("/:id", eliminarReserva);

router.get("/cliente/:nombre", filtrarPorCliente);
router.get("/fecha/:fecha", filtrarPorFecha);
router.get("/hotel/:nombre", filtrarPorHotel);
router.get("/ordenar/fecha", ordenarPorFecha);
router.get("/activas", obtenerActivas);
router.get("/canceladas", obtenerCanceladas);

export default router;
