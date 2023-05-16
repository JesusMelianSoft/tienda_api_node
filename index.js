const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurar el middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos',
});

// Establecer la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});


///CLIENTES
// Obtener todos los clientes
app.get('/clientes', (req, res) => {
    connection.query('SELECT * FROM clientes', (err, results) => {
      if (err) {
        console.error('Error al obtener los clientes:', err);
        res.status(500).json({ error: 'Error al obtener los clientes' });
      } else {
        res.json(results);
      }
    });
  });
  
  // Obtener un cliente por su código
  app.get('/clientes/:cod_cliente', (req, res) => {
    const codCliente = req.params.cod_cliente;
    connection.query(
      'SELECT * FROM clientes WHERE cod_cliente = ?',
      [codCliente],
      (err, results) => {
        if (err) {
          console.error('Error al obtener el cliente:', err);
          res.status(500).json({ error: 'Error al obtener el cliente' });
        } else if (results.length === 0) {
          res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });

  // Crear un nuevo cliente
app.post('/clientes', (req, res) => {
    const nuevoCliente = req.body;
    connection.query('INSERT INTO clientes SET ?', nuevoCliente, (err, result) => {
      if (err) {
        console.error('Error al crear el cliente:', err);
        res.status(500).json({ error: 'Error al crear el cliente' });
      } else {
        res.status(201).json({ message: 'Cliente creado exitosamente' });
      }
    });
  });
  
  // Actualizar un cliente
  app.put('/clientes/:cod_cliente', (req, res) => {
    const codCliente = req.params.cod_cliente;
    const datosCliente = req.body;
    connection.query(
      'UPDATE clientes SET ? WHERE cod_cliente = ?',
      [datosCliente, codCliente],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar el cliente:', err);
          res.status(500).json({ error: 'Error al actualizar el cliente' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            res.json({ message: 'Cliente actualizado exitosamente' });
        }
    });
  });
  
  // Eliminar un cliente
  app.delete('/clientes/:cod_cliente', (req, res) => {
    const codCliente = req.params.cod_cliente;
    connection.query('DELETE FROM clientes WHERE cod_cliente = ?', [codCliente], (err, result) => {
        if (err) {
            console.error('Error al eliminar el cliente:', err);
            res.status(500).json({ error: 'Error al eliminar el cliente' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            res.json({ message: 'Cliente eliminado exitosamente' });
        }
    });
  });
  
  

  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`La API está funcionando en http://localhost:${port}`);
  });