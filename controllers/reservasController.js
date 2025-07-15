import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
const getReservas = './data/reservas.json';

// funciones DRY
const cargarReservas = async () => {
  const data = await fs.readFile(getReservas, 'utf-8');
  return JSON.parse(data);
};

const fechaActual = async () => {
  return new Date().toLocaleDateString('en-CA'); // formato YYYY-MM-DD
};

const obtenerProximoMes = async () => {
  const hoy = await fechaActual();
  const [anioActualStr, mesActualStr] = hoy.split('-');
  const sumarMes = Number(mesActualStr) + 1;
  const siguienteMes = sumarMes === 13 ? 1 : sumarMes;
  const anioActual = Number(anioActualStr);
  return { mes: siguienteMes, anio: anioActual };
};

// operaciones CRUD
// Obtener la lista de reservas
export const obtenerReservas = async (req, res) => {
  try {
    const reserva = await cargarReservas();
    const hoy = await fechaActual();
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
        .json({ mensaje: 'Reserva no encontrada con ese número' });
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

// filtros
export const filtrarPorHotel = async (req, res) => {
  try {
    const { hotel } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.filter(
      (r) => r.hotel.toLowerCase() === hotel.toLowerCase()
    );

    if (resultado.length === 0) {
      return res
        .status(404)
        .json({ mensaje: 'No se encontraron reservas para ese hotel' });
    }

    res.json({
      mensaje: 'Reserva encontradas',
      reservas: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al filtrar la reserva' });
  }
};

// Filtrar reservas por rango de fechas
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
export const filtrarPorHabitacion = async (req, res) => {
  try {
    const { habitacion } = req.params;
    const reserva = await cargarReservas();
    const { mes, anio } = await obtenerProximoMes();

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
export const filtrarPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const reserva = await cargarReservas();
    const resultado = reserva.filter(
      (r) => r.estado.toLowerCase() === estado.toLowerCase()
    );

    if (resultado.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron el estado indicado',
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
export const filtrarPorHuesped = async (req, res) => {
  try {
    const reserva = await cargarReservas();
    const { mes, anio } = await obtenerProximoMes();

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
