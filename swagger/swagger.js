import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Reservas Hoteleras',
    version: '1.0.0',
    description: 'Gestión de reservas para el Hotel Paraíso',
  },
  servers: [
    {
      url: 'https://four-proyecto-reservas-hotelera-pzd0.onrender.com/api/reservas',
      description: 'Servidor en Render',
    },
    {
      url: 'http://localhost:3000/api/reservas',
      description: 'Servidor local',
    },
  ],
  components: {
    schemas: {
      Reserva: {
        type: 'object',
        required: [
          'hotel',
          'reservas',
          'fecha_inicio',
          'fecha_fin',
          'tipo_habitacion',
          'huesped_adultos',
          'huesped_ninos',
          'num_huespedes',
          'estado',
        ],
        properties: {
          id: { type: 'string', format: 'uuid', example: 'auto-generado' },
          hotel: { type: 'string', example: 'Hotel Paraíso' },
          reservas: { type: 'integer', example: 12345 },
          fecha_inicio: {
            type: 'string',
            format: 'date',
            example: '2025-07-15',
          },
          fecha_fin: { type: 'string', format: 'date', example: '2025-07-20' },
          tipo_habitacion: { type: 'string', example: 'doble' },
          huesped_adultos: { type: 'integer', example: 2 },
          huesped_ninos: { type: 'integer', example: 1 },
          num_huespedes: { type: 'integer', example: 3 },
          estado: { type: 'string', example: 'pendiente' },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};
