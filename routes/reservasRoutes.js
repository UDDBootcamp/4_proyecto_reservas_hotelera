import { Router } from 'express';
import {
  obtenerReservas,
  obtenerReservasIndividual,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  filtrarPorHotel,
  filtrarPorFecha,
  filtrarPorHabitacion,
  filtrarPorEstado,
  filtrarPorHuesped,
  // obtenerCanceladas,
} from '../controllers/reservasController.js';

const router = Router();

router.get('/', obtenerReservas);
router.get('/reservaIndividual/:reservaIndividual', obtenerReservasIndividual);
router.post('/', crearReserva);
router.put('/:id', actualizarReserva);
router.delete('/:id', eliminarReserva);

router.get('/filtrar/:hotel', filtrarPorHotel);
router.get('/fecha', filtrarPorFecha);
router.get('/habitacion/:habitacion', filtrarPorHabitacion);
router.get('/estado/:estado', filtrarPorEstado);
router.get('/huesped', filtrarPorHuesped);
// router.get("/canceladas", obtenerCanceladas);

export default router;
