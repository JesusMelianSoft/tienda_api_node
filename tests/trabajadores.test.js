const request = require('supertest');
const app = require('../index');

describe('Endpoint /trabajadores', () => {
  // Test para obtener trabajadores filtrados
  it('Debería retornar los trabajadores filtrados por cod_user, name y pass', async () => {
    const cod_user = 123;
    const name = 'John';
    const pass = 'password';

    const response = await request(app)
      .get('/trabajadores')
      .query({ cod_user, name, pass });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        cod_user: 123,
        name: 'John',
        pass: 'password',
      },
    ]);
  });

  // Test para cuando no se encuentran trabajadores filtrados
  it('Debería retornar un array vacío si no se encuentran trabajadores', async () => {
    const cod_user = 456;
    const name = 'Jane';
    const pass = 'password123';

    const response = await request(app)
      .get('/trabajadores')
      .query({ cod_user, name, pass });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test para manejar errores internos del servidor
  it('Debería retornar un error 500 en caso de un error interno del servidor', async () => {
    // Simulamos un error de conexión a la base de datos
    jest.spyOn(app.locals.connection, 'query').mockImplementation((query, callback) => {
      callback(new Error('Error de conexión a la base de datos'), null);
    });

    const cod_user = 123;
    const name = 'John';
    const pass = 'password';

    const response = await request(app)
      .get('/trabajadores')
      .query({ cod_user, name, pass });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error interno del servidor' });
  });
});
