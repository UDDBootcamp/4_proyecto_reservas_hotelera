let getReservas = [
  {
    id: 1,
    reserva: true,
  },
];
let reservas = [];
let idActual = 1;

// operaciones CRUD
// export const obtenerReservas = async (req, res) => {
//   try {
//     const reservas = await getReservas();
//     res.json(reservas);
//   } catch (error) {
//     res.status(500).json({ mensaje: "Error al obtener las reservas" });
//   }
// };

export const obtenerReservas = (req, res) => {
  res.json(reservas);
};

export const crearReserva = (req, res) => {
  const { cliente, hotel, fecha, estado } = req.body;
  const nueva = { id: idActual++, cliente, hotel, fecha, estado };
  reservas.push(nueva);
  res.status(201).json(nueva);
};

export const actualizarReserva = (req, res) => {
  const id = parseInt(req.params.id);
  const reserva = reserva.find((r) => r.id === id);
  if (reserva) {
    Object.assign(reserva, req.body);
    res.json(reserva);
  } else {
    res.status(404).json({ mensaje: "La reserva no fue encontrada" });
  }
};

export const eliminarReserva = (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservas.findIndex((r) => r.id === id);
  if (index !== -1) {
    const eliminada = reservas.splice(index, 1);
    res.json(eliminada[0]);
  } else {
    res.status(404).json({ mensaje: "La reserva no fue encontrada" });
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
  res.json(reservas.filter((r) => r.estado === "activa"));
};

export const obtenerCanceladas = (req, res) => {
  res.json(reservas.filter((r) => r.estado === "cancelada"));
};
