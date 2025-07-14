import fs from 'fs/promises';
const getReservas = './data/reservas.json';

// operaciones CRUD
export const obtenerReservas = async (req, res) => {
  try {
    const data = await fs.readFile(getReservas, 'utf-8');
    const reservas = JSON.parse(data);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

export const obtenerReservasIndividual = async (req, res) => {
  try {
    const { reservaIndividual } = req.params;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
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
      reserva: reserva[resultado],
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

export const crearReserva = async (req, res) => {
  try {
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
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

    const ultimoId =
      reserva.length > 0 ? Math.max(...reserva.map((r) => r.id)) : 0;

    const nueva = {
      id: ultimoId + 1,
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
    reservas.push(nueva);
    await fs.writeFile(getReservas, JSON.stringify(reservas, null, 2));

    res.status(201).json({ mensaje: 'Reserva creada con éxito', nueva });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

export const actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
    const resultado = reserva.findIndex((r) => r.reservas === Number(id));

    if (resultado === -1) {
      return res
        .status(404)
        .json({ mensaje: 'Reserva no encontrada con ese número' });
    }

    reserva[index] = {
      ...reserva[index],
      ...req.body,
    };
    await fs.writeFile(getReservas, JSON.stringify(reserva, null, 2));

    res.json({
      mensaje: 'Reserva actualizada con éxito',
      reserva: reserva[index],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la reserva' });
  }
};

export const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
    const resultado = reserva.findIndex((r) => r.id === Number(id));

    if (resultado !== -1) {
      const eliminada = reserva.splice(index, 1);
      await fs.writeFile(getReservas, JSON.stringify(reserva, null, 2));

      res.json({
        mensaje: 'La reserva fue eliminada con éxito',
        reserva: eliminada[0],
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
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
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
      reserva: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al filtrar la reserva' });
  }
};

export const filtrarPorFecha = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
    const resultado = reserva.filter((r) => {
      return (
        r.fecha_inicio &&
        r.fecha_fin &&
        r.fecha_inicio >= fecha_inicio &&
        r.fecha_fin <= fecha_fin
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

export const filtrarPorHabitacion = async (req, res) => {
  try {
    const { habitacion } = req.params;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
    const resultado = reserva.filter(
      (r) => r.tipo_habitacion.toLowerCase() === habitacion.toLowerCase()
    );

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

export const filtrarPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
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

export const filtrarPorHuesped = async (req, res) => {
  try {
    const data = await fs.readFile(getReservas, 'utf-8');
    const reserva = JSON.parse(data);
    const resultado = reserva.filter((r) => r.num_huespedes > 5);

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
