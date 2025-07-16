import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
const getReservas = './data/reservas.json';

// Funciones DRY
// Cargar todas las reservas
const cargarReservas = async () => {
  const data = await fs.readFile(getReservas, 'utf-8');
  return JSON.parse(data);
};

// Obtengo la fecha actual
const fechaActual = () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡Mes comienza en 0!
  const día = String(fecha.getDate()).padStart(2, '0');

  return `${año}-${mes}-${día}`; // Siempre YYYY-MM-DD
};

// Obtener el próximo mes
const obtenerProximoMes = () => {
  const hoy = fechaActual();
  const [anioActualStr, mesActualStr] = hoy.split('-');
  const sumarMes = Number(mesActualStr) + 1;
  const siguienteMes = sumarMes === 13 ? 1 : sumarMes;
  const anioActual = Number(anioActualStr);
  return { mes: siguienteMes, anio: anioActual };
};

// Operaciones CRUD
// Obtener la lista de reservas
/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtener reservas programadas para hoy
 *     tags:
 *       - Reservas
 *     responses:
 *       200:
 *         description: Reserva programadas para hoy
 *       404:
 *         description: No hay reservas para hoy
 */
export const obtenerReservas = async (req, res) => {
  try {
    const reserva = await cargarReservas();
    const hoy = fechaActual();
    console.log(hoy);

    const resultado = reserva.filter((r) => r.fecha_inicio === hoy);

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No hay reservas para hoy' });
    }

    res.json({
      mensaje: 'Reserva programadas para hoy',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

// Crear reserva
/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Reserva creada con éxito
 *       500:
 *         description: Error al crear la reserva
 */
export const crearReserva = async (req, res) => {
  try {
    const reserva = await cargarReservas();
    const {
      hotel,
      reservas: nombreReserva,
      fecha_inicio,
      fecha_fin,
      tipo_habitacion,
      huesped_adultos,
      huesped_ninos,
      num_huespedes,
      estado,
    } = req.body;

    const nueva = {
      id: uuidv4(),
      hotel,
      reservas: nombreReserva,
      fecha_inicio,
      fecha_fin,
      tipo_habitacion,
      huesped_adultos,
      huesped_ninos,
      num_huespedes,
      estado,
    };
    reserva.push(nueva);
    await fs.writeFile(getReservas, JSON.stringify(reserva, null, 2));

    res.status(201).json({ mensaje: 'Reserva creada con éxito', nueva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

// Actualizar información de una reserva
/**
 * @swagger
 * /{idReserva}:
 *   put:
 *     summary: Actualizar el tipo de habitación de una reserva existente
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de la reserva a actualizar (ej. 12345)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_habitacion:
 *                 type: string
 *                 example: "suite familiar"
 *             required:
 *               - tipo_habitacion
 *     responses:
 *       200:
 *         description: Reserva actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 reservas:
 *                   $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva no encontrada con el número de reserva
 */
export const actualizarReserva = async (req, res) => {
  try {
    const { idReserva } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.findIndex(
      (r) => r.reservas === Number(idReserva)
    );

    if (resultado === -1) {
      return res
        .status(404)
        .json({ mensaje: 'Reserva no encontrada con el número de reserva' });
    }

    reserva[resultado] = {
      ...reserva[resultado],
      ...req.body,
    };
    await fs.writeFile(getReservas, JSON.stringify(reserva, null, 2));

    res.json({
      mensaje: 'Reserva actualizada con éxito',
      reservas: reserva[resultado],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la reserva' });
  }
};

// Eliminar una reserva específica
/**
 * @swagger
 * /{idReserva}:
 *   delete:
 *     summary: Eliminar una reserva específica con el número de reserva
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: idReserva
 *         required: true
 *         schema:
 *           type: string
 *         description: Eliminar reserva (ej. 12345)

 *     responses:
 *       200:
 *         description: La reserva fue eliminada con éxito
 *       404:
 *         description: La reserva no fue encontrada
 */
export const eliminarReserva = async (req, res) => {
  try {
    const { idReserva } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.findIndex(
      (r) => r.reservas === Number(idReserva)
    );

    if (resultado !== -1) {
      const eliminada = reserva.splice(resultado, 1);
      await fs.writeFile(getReservas, JSON.stringify(reserva, null, 2));

      res.json({
        mensaje: 'La reserva fue eliminada con éxito',
        reservas: eliminada[0],
      });
    } else {
      res.status(404).json({ mensaje: 'La reserva no fue encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la reserva' });
  }
};

// Filtros
//Filtrar reservas por hotel
/**
 * @swagger
 * /filtrar/{hotel}:
 *   get:
 *     summary: Filtrar reservas para el próximo por nombre de hotel
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: path
 *         name: hotel
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del hotel a filtrar (ej. Hotel Paraíso)
 *     responses:
 *       200:
 *         description: Reservas encontradas para el próximo mes en ese hotel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: No se encontraron reservas del hotel para el próximo mes
 *       500:
 *         description: Error interno al filtrar por el hotel
 */
export const filtrarPorHotel = async (req, res) => {
  try {
    const { hotel } = req.params;
    const reserva = await cargarReservas();
    const { mes, anio } = obtenerProximoMes();

    const resultado = reserva.filter((r) => {
      const [anioReservaStr, mesReservaStr] = r.fecha_inicio.split('-');
      const anioReserva = Number(anioReservaStr);
      const mesReserva = Number(mesReservaStr);

      return (
        r.hotel.toLowerCase() === hotel.toLowerCase() &&
        mesReserva === mes &&
        anioReserva === anio
      );
    });

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron reservas del hotel para el próximo mes ',
      });
    }

    res.json({
      mensaje: 'Reserva encontradas para el próximo mes',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno al filtrar por el hotel' });
  }
};

// Filtrar reservas por rango de fechas
/**
 * @swagger
 * /fecha:
 *   get:
 *     summary: Filtrar reservas por rango de fechas
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: true
 *         schema:
 *           type: string
 *         description: Rango de fechas a filtrar (ej. 2025-12-22)
 *       - in: query
 *         name: fecha_fin
 *         required: true
 *         schema:
 *           type: string
 *         description: Rango de fechas a filtrar (ej. 2025-12-28)
 *     responses:
 *       200:
 *         description: Reservas encontradas en el rango de fechas
 *       404:
 *         description: No se encontraron reservas entre las fechas indicadas
 */
export const filtrarPorFecha = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const reserva = await cargarReservas();
    const resultado = reserva.filter((r) => {
      return (
        r.fecha_inicio &&
        r.fecha_fin &&
        r.fecha_inicio <= fecha_fin &&
        r.fecha_fin >= fecha_inicio
      );
    });

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron reservas entre las fechas indicadas',
      });
    }

    res.json({
      mensaje: 'Reservas encontradas en el rango de fechas',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al filtrar la reserva por fechas' });
  }
};

// Filtrar reservas por tipo de habitación
/**
 * @swagger
 * /habitacion/{habitacion}:
 *   get:
 *     summary: Filtrar reservas por tipo de habitación en el próximo mes
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: path
 *         name: habitacion
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de habitación (ej. suites de lujo)
 *     responses:
 *       200:
 *         description: Reservas encontradas según tipo de habitación
 *       404:
 *         description: No se encontraron habitaciones indicadas
 */
export const filtrarPorHabitacion = async (req, res) => {
  try {
    const { habitacion } = req.params;
    const reserva = await cargarReservas();
    const { mes, anio } = obtenerProximoMes();

    const resultado = reserva.filter((r) => {
      const [anioReservaStr, mesReservaStr] = r.fecha_inicio.split('-');
      const anioReserva = Number(anioReservaStr);
      const mesReserva = Number(mesReservaStr);

      return (
        r.tipo_habitacion.toLowerCase() === habitacion.toLowerCase() &&
        mesReserva === mes &&
        anioReserva === anio
      );
    });

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron habitaciones indicadas',
      });
    }

    res.json({
      mensaje: 'Reservas encontradas según tipo de habitación',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: 'Error al filtrar la reserva por habitación' });
  }
};

// Filtrar reservas por estado
/**
 * @swagger
 * /estado/{estado}:
 *   get:
 *     summary: Filtrar reservas por estado (ej. pendiente, pagado)
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *         description: Filtrar reservas según estado (ej. pendiente, pagado)
 *     responses:
 *       200:
 *         description: Reservas encontradas según tipo de estado
 *       404:
 *         description: No se encontraron reservas con ese estado
 */
export const filtrarPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.filter(
      (r) => r.estado.toLowerCase() === estado.toLowerCase()
    );

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron reservas con ese estado',
      });
    }

    res.json({
      mensaje: 'Reservas encontradas según tipo de estado',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al filtrar la reserva por estado' });
  }
};

// Filtrar reservas por número de huéspedes
/**
 * @swagger
 * /huesped:
 *   get:
 *     summary: Filtrar reservas para grupos de más de 5 huéspedes del próximo mes
 *     tags:
 *       - Filtros
 *     responses:
 *       200:
 *         description: Reservas encontradas con más de 5 huéspedes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: No existen más de 5 huéspedes
 *       500:
 *         description: Error interno al filtrar por huéspedes
 */
export const filtrarPorHuesped = async (req, res) => {
  try {
    const reserva = await cargarReservas();
    const { mes, anio } = obtenerProximoMes();

    const resultado = reserva.filter((r) => {
      const [anioReservaStr, mesReservaStr] = r.fecha_inicio.split('-');
      const anioReserva = Number(anioReservaStr);
      const mesReserva = Number(mesReservaStr);

      return r.num_huespedes > 5 && mesReserva === mes && anioReserva === anio;
    });

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No existen más de 5 huéspedes',
      });
    }

    res.json({
      mensaje: 'Reservas encontradas con más de 5 huéspedes',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: 'Error al filtrar la reserva por huéspedes' });
  }
};

// Obtener información de una reserva específica
/**
 * @swagger
 * /reservaIndividual/{reservaIndividual}:
 *   get:
 *     summary: Obtener detalles de una reserva específica
 *     tags:
 *       - Filtros
 *     parameters:
 *       - in: path
 *         name: reservaIndividual
 *         required: true
 *         schema:
 *           type: string
 *         description: Filtrar por número de reserva (ej. 12345)
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva no encontrada con ese número
 */
export const obtenerReservasIndividual = async (req, res) => {
  try {
    const { reservaIndividual } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.findIndex(
      (r) => r.reservas === Number(reservaIndividual)
    );

    if (resultado === -1) {
      return res
        .status(404)
        .json({ mensaje: 'Reserva no encontrada con ese número' });
    }

    res.json({
      mensaje: 'Reserva encontrada',
      reservas: reserva[resultado],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};
