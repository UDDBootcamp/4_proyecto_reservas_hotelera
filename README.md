# Proyecto 4 - API de Reservas Hoteleras (Hotel Paraíso)

El **Proyecto N° 4**, es una aplicación Express que simula una lista de reservas para el **hotel Paraíso** mediante una API con las siguientes funcionalidades:

---

**Ruta base**  
http://localhost:3000/api/reservas

---

**Obtener reservas**  
**Método GET /**

- Como gerente del hotel, quiero ver una lista de todas las reservas para hoy para poder planificar el trabajo del personal de limpieza y recepción.

---

**Crear reserva**  
**Método POST /**  
/

- Como viajero, quiero hacer una reserva en el hotel "Hotel Paraíso" para el 15 de mayo de 2023. Necesito una habitación doble para dos adultos y un niño.

```
Body:
{
    "hotel":"Hotel Paraíso",
    "reservas": 12345,
    "fecha_inicio": "2025-07-15",
    "fecha_fin": "2025-08-20",
    "tipo_habitacion":"doble",
    "huesped_adultos":3,
    "huesped_ninos":3,
    "num_huespedes":6,
    "estado":"pagado"
}
```

---

**Modificar reserva**  
**Método PUT /:idReserva**  
/12345

- Como huésped, necesito cambiar mi reserva en el hotel "Hotel Paraíso". Originalmente reservé una habitación doble, pero ahora necesito una suite familiar. Mi número de reserva es 12345.

---

**Borrar reserva**  
**Método DELETE /:idReserva**  
/12345

- Como viajero, tuve un cambio de planes y ya no necesito la habitación que reservé en el hotel "Hotel Paraíso". Mi número de reserva es 12345.

---

**Filtrar reservas por hotel**  
**Método GET /filtrar/:hotel**  
/filtrar/Hotel Paraíso

- Como gerente de una cadena de hoteles, quiero ver todas las reservas para el "Hotel Paraíso" para el próximo mes.

---

**Filtrar reservas por rango de fechas**  
**Método GET /fecha**  
/fecha?fecha_inicio=2025-07-20&fecha_fin=2025-07-30

- Como gerente del hotel, quiero ver todas las reservas para la semana de Navidad para poder planificar el personal y las actividades necesarias.

---

**Filtrar reservas por tipo de habitación**  
**Método GET /habitacion/:habitacion**  
/habitacion/individual

- Como gerente del hotel, quiero ver todas las reservas para nuestras suites de lujo para el próximo mes para asegurarme de que todo esté en perfectas condiciones para nuestros huéspedes VIP.

---

**Filtrar reservas por estado**  
**Método GET /estado/:estado**  
/estado/pendiente

- Como gerente del hotel, quiero ver todas las reservas que están pendientes de pago para poder hacer un seguimiento con los clientes.

---

**Filtrar reservas por número de huéspedes**  
**Método GET /huesped**  
/huesped

- Como gerente del hotel, quiero ver todas las reservas para grupos de más de 5 personas para el próximo mes, para poder planificar las necesidades adicionales de estos grupos grandes.

---

**Filtrar reservas individual**  
**Método GET /reservaIndividual/:reservaIndividual**  
/reservaIndividual/12345

- Como recepcionista, necesito verificar los detalles de la reserva del huésped que acaba de llegar al hotel. Su número de reserva es 12345.
