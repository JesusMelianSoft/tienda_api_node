const request = require('supertest');
const app = require('../index');

describe('Tests para el endpoint de clientes', () => {
  // Test para obtener todos los clientes
  it('Debería obtener todos los clientes', async () => {
    const response = await request(app).get('/clientes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test para obtener un cliente específico
  it('Debería obtener un cliente por su ID', async () => {
    const response = await request(app).get('/clientes/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cod_cliente', 1);
  });

  // Test para crear un nuevo cliente
  it('Debería crear un nuevo cliente', async () => {
    const nuevoCliente = {
      nombre_c: 'John',
      apellidos_c: 'Doe',
      direccion_c: 'Calle Principal',
      telefono_c: 123456789,
      email_c: 'john@example.com',
      debe: 0,
      fecha_creación: '2023-05-01',
      ult_fecha_pago: null,
      DNI_NIF: '12345678X',
      cod_user: 1
    };

    const response = await request(app)
      .post('/clientes')
      .send(nuevoCliente);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('cod_cliente');
  });

  // Test para actualizar un cliente existente
  it('Debería actualizar un cliente existente', async () => {
    const clienteActualizado = {
      nombre_c: 'Jane',
      apellidos_c: 'Doe',
      direccion_c: 'Calle Principal',
      telefono_c: 987654321,
      email_c: 'jane@example.com',
      debe: 100,
      fecha_creación: '2023-05-01',
      ult_fecha_pago: '2023-05-15',
      DNI_NIF: '87654321Y',
      cod_user: 1
    };

    const response = await request(app)
      .put('/clientes/1')
      .send(clienteActualizado);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nombre_c', 'Jane');
    expect(response.body).toHaveProperty('telefono_c', 987654321);
  });

  // Test para eliminar un cliente existente
  it('Debería eliminar un cliente existente', async () => {
    const response = await request(app).delete('/clientes/1');
    expect(response.status).toBe(204);
  });
});
