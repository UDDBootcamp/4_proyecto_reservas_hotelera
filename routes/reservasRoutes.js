import { Router } from 'express';
import {
  obtenerReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  filtrarPorHotel,
  filtrarPorFecha,
  filtrarPorHabitacion,
  filtrarPorEstado,
  filtrarPorHuesped,
  obtenerReservasIndividual,
} from '../controllers/reservasController.js';

const router = Router();

router.get('/', obtenerReservas);
router.post('/', crearReserva);
router.put('/:idReserva', actualizarReserva);
router.delete('/:idReserva', eliminarReserva);

router.get('/filtrar/:hotel', filtrarPorHotel);
router.get('/fecha', filtrarPorFecha);
router.get('/habitacion/:habitacion', filtrarPorHabitacion);
router.get('/estado/:estado', filtrarPorEstado);
router.get('/huesped', filtrarPorHuesped);
router.get('/reservaIndividual/:reservaIndividual', obtenerReservasIndividual);

export default router;
