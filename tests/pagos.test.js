const request = require('supertest');
const app = require('../index');

describe('Tests para el endpoint de pagos', () => {
  // Test para obtener todos los pagos
  it('Debería obtener todos los pagos', async () => {
    const response = await request(app).get('/pagos');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test para obtener un pago específico
  it('Debería obtener un pago por su ID', async () => {
    const response = await request(app).get('/pagos/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cod_pago', 1);
  });

  // Test para crear un nuevo pago
  it('Debería crear un nuevo pago', async () => {
    const nuevoPago = {
      cod_cliente_p: 1,
      nombre_c_p: 'John Doe',
      apellidos_c_p: 'Doe',
      fecha_pago: '2023-05-01',
      tipo_de_pago: 'Efectivo',
      cantidad_pago: 100.00,
      vista: 1,
      cod_user: 1,
      semana: 1,
      mes: 5,
      anio: 2023
    };

    const response = await request(app)
      .post('/pagos')
      .send(nuevoPago);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('cod_pago');
  });

  // Test para actualizar un pago existente
  it('Debería actualizar un pago existente', async () => {
    const pagoActualizado = {
      cod_cliente_p: 1,
      nombre_c_p: 'John Doe',
      apellidos_c_p: 'Doe',
      fecha_pago: '2023-05-01',
      tipo_de_pago: 'Tarjeta',
      cantidad_pago: 150.00,
      vista: 1,
      cod_user: 1,
      semana: 1,
      mes: 5,
      anio: 2023
    };

    const response = await request(app)
      .put('/pagos/1')
      .send(pagoActualizado);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('tipo_de_pago', 'Tarjeta');
    expect(response.body).toHaveProperty('cantidad_pago', 150.00);
  });

  // Test para eliminar un pago existente
  it('Debería eliminar un pago existente', async () => {
    const response = await request(app).delete('/pagos/1');
    expect(response.status).toBe(204);
  });
});
