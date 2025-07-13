import fs from 'fs/promises';
const getReservas = './data/reservas.json';

let idActual = 1;

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

export const crearReserva = async (req, res) => {
  try {
    const data = await fs.readFile(getReservas, 'utf-8');
    const reservas = JSON.parse(data);
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
      id: idActual++,
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
    const id = parseInt(req.params.id);
    const data = await fs.readFile(getReservas, 'utf-8');
    const reservas = JSON.parse(data);

    const index = reservas.findIndex((r) => r.reservas === id);
    if (index === -1) {
      return res
        .status(404)
        .json({ mensaje: 'Reserva no encontrada con ese número' });
    }

    reservas[index] = {
      ...reservas[index],
      ...req.body,
    };
    await fs.writeFile(getReservas, JSON.stringify(reservas, null, 2));

    res.json({
      mensaje: 'Reserva actualizada con éxito',
      reserva: reservas[index],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la reserva' });
  }
};

/////////////////////////////////////////

export const eliminarReserva = (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservas.findIndex((r) => r.id === id);
  if (index !== -1) {
    const eliminada = reservas.splice(index, 1);
    res.json(eliminada[0]);
  } else {
    res.status(404).json({ mensaje: 'La reserva no fue encontrada' });
  }
};

// filtros
export const filtrarPorHotel = (req, res) => {
  const { nombre } = req.params;

  res.json(
    reservas.filter((r) => r.hotel.toLowerCase() === nombre.toLowerCase())
  );
};

export const filtrarPorFecha = (req, res) => {
  const { fecha } = req.params;
  res.json(reservas.filter((r) => r.fecha === fecha));
};

export const filtrarPorCliente = (req, res) => {
  const { nombre } = req.params;
  res.json(
    reservas.filter((r) => r.cliente.toLowerCase() === nombre.toLowerCase())
  );
};

export const ordenarPorFecha = (req, res) => {
  const ordenadas = [...reservas].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );
  res.json(ordenadas);
};

export const obtenerActivas = (req, res) => {
  res.json(reservas.filter((r) => r.estado === 'activa'));
};

export const obtenerCanceladas = (req, res) => {
  res.json(reservas.filter((r) => r.estado === 'cancelada'));
};
