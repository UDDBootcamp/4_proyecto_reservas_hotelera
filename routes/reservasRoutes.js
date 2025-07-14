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
} from '../controllers/reservasController.js';

const router = Router();

router.get('/', obtenerReservas);
router.get('/reservaIndividual/:reservaIndividual', obtenerReservasIndividual);
router.post('/', crearReserva);
router.put('/:idReserva', actualizarReserva);
router.delete('/:idReserva', eliminarReserva);

router.get('/filtrar/:hotel', filtrarPorHotel);
router.get('/fecha', filtrarPorFecha);
router.get('/habitacion/:habitacion', filtrarPorHabitacion);
router.get('/estado/:estado', filtrarPorEstado);
router.get('/huesped', filtrarPorHuesped);

export default router;
