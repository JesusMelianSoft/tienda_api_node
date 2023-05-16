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
  
  
//COMPRASB
//Obtener todas las compras
app.get('/comprasb', (req, res) => {
    connection.query('SELECT * FROM comprasb', (err, results) => {
      if (err) {
        console.error('Error al obtener las compras:', err);
        res.status(500).json({ error: 'Error al obtener las compras' });
      } else {
        res.json(results);
      }
    });
  });

  //obtener compra por cod
  app.get('/comprasb/:codCom', (req, res) => {
    const codCom = req.params.codCom;
    connection.query(
      'SELECT * FROM comprasb WHERE codCom = ?',
      [codCom],
      (err, results) => {
        if (err) {
          console.error('Error al obtener la compra:', err);
          res.status(500).json({ error: 'Error al obtener la compra' });
        } else if (results.length === 0) {
          res.status(404).json({ error: 'Compra no encontrada' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });

  //Insertar compra
  app.post('/comprasb', (req, res) => {
    const nuevaCompra = req.body;
    connection.query('INSERT INTO comprasb SET ?', nuevaCompra, (err, result) => {
      if (err) {
        console.error('Error al crear la compra:', err);
        res.status(500).json({ error: 'Error al crear la compra' });
      } else {
        res.status(201).json({ message: 'Compra creada exitosamente' });
      }
    });
  });

  //Actualizar compra
  app.put('/comprasb/:codCom', (req, res) => {
    const codCom = req.params.codCom;
    const datosCompra = req.body;
    connection.query(
      'UPDATE comprasb SET ? WHERE codCom = ?',
      [datosCompra, codCom],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar la compra:', err);
          res.status(500).json({ error: 'Error al actualizar la compra' });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Compra no encontrada' });
        } else {
          res.json({ message: 'Compra actualizada exitosamente' });
        }
      }
    );
  });
  
//Eliminar una compra
app.delete('/comprasb/:codCom', (req, res) => {
    const codCom = req.params.codCom;
    connection.query(
      'DELETE FROM comprasb WHERE codCom = ?',
      [codCom],
      (err, result) => {
        if (err) {
          console.error('Error al eliminar la compra:', err);
          res.status(500).json({ error: 'Error al eliminar la compra' });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Compra no encontrada' });
        } else {
          res.json({ message: 'Compra eliminada exitosamente' });
        }
      }
    );
  });


  //PAGOSB
  //Obtener todos los pagos
  app.get('/pagos', (req, res) => {
    connection.query('SELECT * FROM pagos', (err, results) => {
      if (err) {
        console.error('Error al obtener los pagos:', err);
        res.status(500).json({ error: 'Error al obtener los pagos' });
      } else {
        res.json(results);
      }
    });
  });

  //Obtener pagos por su codigo
  app.get('/pagos/:cod_pago', (req, res) => {
    const cod_pago = req.params.cod_pago;
    connection.query(
      'SELECT * FROM pagos WHERE cod_pago = ?',
      [cod_pago],
      (err, results) => {
        if (err) {
          console.error('Error al obtener el pago:', err);
          res.status(500).json({ error: 'Error al obtener el pago' });
        } else if (results.length === 0) {
          res.status(404).json({ error: 'Pago no encontrado' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });

  //Crear un nuevo pago

  app.post('/pagos', (req, res) => {
    const nuevoPago = req.body;
    connection.query('INSERT INTO pagos SET ?', nuevoPago, (err, result) => {
      if (err) {
        console.error('Error al crear el pago:', err);
        res.status(500).json({ error: 'Error al crear el pago' });
      } else {
        res.status(201).json({ message: 'Pago creado exitosamente' });
      }
    });
  });
  
  //Actualizar un pago
  app.put('/pagos/:cod_pago', (req, res) => {
    const cod_pago = req.params.cod_pago;
    const datosPago = req.body;
    connection.query(
      'UPDATE pagos SET ? WHERE cod_pago = ?',
      [datosPago, cod_pago],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar el pago:', err);
          res.status(500).json({ error: 'Error al actualizar el pago' });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Pago no encontrado' });
        } else {
          res.json({ message: 'Pago actualizado exitosamente' });
        }
      }
    );
  });

  //Eliminar un pago

  app.delete('/pagos/:cod_pago', (req, res) => {
    const cod_pago = req.params.cod_pago;
    connection.query(
      'DELETE FROM pagos WHERE cod_pago = ?',
      [cod_pago],
      (err, result) => {
        if (err) {
          console.error('Error al eliminar el pago:', err);
          res.status(500).json({ error: 'Error al eliminar el pago' });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Pago no encontrado' });
        } else {
          res.json({ message: 'Pago eliminado exitosamente' });
        }
      }
    );
  });
  
  //
  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`La API está funcionando en http://localhost:${port}`);
  });