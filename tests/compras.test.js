const request = require('supertest');
const app = require('../index');

describe('Tests para el endpoint de compras', () => {
  // Test para obtener todas las compras
  it('Debería obtener todas las compras', async () => {
    const response = await request(app).get('/compras');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test para obtener una compra específica
  it('Debería obtener una compra por su ID', async () => {
    const response = await request(app).get('/compras/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('codCom', 1);
  });

  // Test para crear una nueva compra
  it('Debería crear una nueva compra', async () => {
    const nuevaCompra = {
      codArt: 1,
      codCli: 1,
      nombreCli: 'John Doe',
      apellidosCli: 'Doe',
      nombreArt: 'Producto 1',
      precio: 10.99,
      cantidad: 1,
      subtotal: 10.99,
      total: 10.99,
      fechaCom: '2023-05-01',
      vista: 1,
      cod_user: 1,
      semana: 1,
      mes: 5,
      anio: 2023
    };

    const response = await request(app)
      .post('/compras')
      .send(nuevaCompra);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('codCom');
  });

  // Test para actualizar una compra existente
  it('Debería actualizar una compra existente', async () => {
    const compraActualizada = {
      codArt: 1,
      codCli: 1,
      nombreCli: 'John Doe',
      apellidosCli: 'Doe',
      nombreArt: 'Producto Actualizado',
      precio: 15.99,
      cantidad: 2,
      subtotal: 31.98,
      total: 31.98,
      fechaCom: '2023-05-01',
      vista: 1,
      cod_user: 1,
      semana: 1,
      mes: 5,
      anio: 2023
    };

    const response = await request(app)
      .put('/compras/1')
      .send(compraActualizada);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nombreArt', 'Producto Actualizado');
    expect(response.body).toHaveProperty('precio', 15.99);
  });

  // Test para eliminar una compra existente
  it('Debería eliminar una compra existente', async () => {
    const response = await request(app).delete('/compras/1');
    expect(response.status).toBe(204);
  });
});
