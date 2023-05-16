const express = require('express');
//Cors nos permite compartir datos dentro del mismo servidor
const cors = require('cors');
const { query } = require('../config/db.js');
const app = express();
app.disable('x-powered-by');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    //permite el control de acceso al origen, permite compartir recursos dentro del mismo servidor
app.use(cors());

let server;
const runServer = () => {
    // Initialize the server
    server = app.listen(8002, () => {
        console.log(
            `Server started at port http://localhost:${server.address().port}`
            );
    })
}

const stopServer = () => {
    console.log('Closing out remaining connection');
    server.close();
}
/*
* Rutas de Nuestra API 
*/

//OBTENER CLIENTES DE UN TRABAJADOR ESPECIFICO
app.get('/api/v1/clients/:cod_user', async(req, res) => {
    const { cod_user } = req.params;
    try {
        const sql = "SELECT * FROM clientes WHERE cod_user =? ORDER BY cod_cliente";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//BUSQUEDA POR nombre o codigo
app.get('/api/v1/clients/:cod_user/:dato', async(req, res) => {
    const { cod_user, dato } = req.params;
    console.log("DATO :",dato);
    var sql="";
    var result;
    try {
        if(dato>0){
            sql = "SELECT * FROM clientes WHERE cod_user =? AND cod_cliente = ? ORDER BY cod_cliente";
            console.log("SQL1", sql);
            result = await query(sql, [cod_user, dato]);
        }else{
            sql = "SELECT * FROM clientes WHERE cod_user =? AND nombre_c LIKE ? ORDER BY cod_cliente";
            console.log("SQL2", sql);
            result = await query(sql, [cod_user, "%"+dato+"%"]);
        }
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'No se encuentra el cliente';
        }else{
            message = 'MOSTRANDO CLIENTES...';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})


//HACER LOGIN EN BD
app.get('/api/v1/trabajador/:name/:pass', async(req, res) => {
    const { name, pass } = req.params;
    try {
        const sql = "SELECT `cod_user` FROM `trabajadores` WHERE name=? AND pass=MD5(?)";
        const result = await query(sql, [name, pass]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})


//OBTENER TRABAJADORES
//HACER LOGIN EN BD
app.get('/api/v1/trabajadores/', async(req, res) => {
    const { name, pass } = req.params;
    try {
        const sql = "SELECT * FROM `trabajadores`";
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

app.get('/api/v1/client/:cod_client/:cod_user', async(req, res) => {
    console.log('PARAMS',req.params);
    const { cod_client, cod_user } = req.params;
    console.log('COD_CLIENTE: '+cod_client);
    console.log('COD_USER: ',cod_user);
    try {
        const sql = "SELECT * FROM clientes WHERE cod_cliente = ? AND cod_user = ?";
        const result = await query(sql, [cod_client, cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all client';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})
//Update client by cod
app.put('/api/v1/client/:cod_client', async(req, res) => {
    console.log(req.body);
    const { cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe } = req.body;
    const { cod_client } = req.params;
    console.log('req.body: ',req.body);

    try {
        const sql = 'UPDATE clientes SET cod_cliente = ?, nombre_c = ?, apellidos_c = ?, direccion_c = ?, telefono_c = ?, email_c = ?, debe = ? WHERE cod_cliente = ?';
        const result = await query(sql, [cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe, cod_client])

        let message = '';
        if(result.changedRows == 0){
            message = 'Actor not found or data are same';
        }else{
            message = 'Actor successfully updated';
        }
        res.send({
            error: false,
            data: {chandedRows: result.chandedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/client/:cod_cliente/:cod_user', async(req, res) => {
    const { cod_cliente, cod_user} = req.params;

    if(!cod_cliente){
        res.status(400).send({ 
            error: true,
            message: 'provide actor id',

        })
    }
    try {
        const sql = "DELETE FROM clientes WHERE cod_cliente = ? AND cod_user = ?";
        const result = await query(sql, [cod_cliente, cod_user]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Client is not found';
        }else{
            message = 'Client successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//OBTENER TOTAL DEL TACO
app.get('/api/v1/totalDebeClient/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(debe) AS suma FROM clientes WHERE clientes.cod_user="+cod_user;
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

// Add new client
app.post('/api/v1/client', async(req, res) => {
    console.log("BODY DE CLIENTE",req.body);
    var { cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe, cod_user} = req.body;

    if(!cod_cliente || !nombre_c) {
        return res.status(400).send({
            error: true,
            message: 'provide actor first_name and last_name'
        })
    }
    if(debe==="" || debe===null || debe===undefined) {
        debe=0;
    }
    if(direccion_c==="" || direccion_c==null || direccion_c===undefined){
        direccion_c="";
    }
    if(telefono_c==="" || telefono_c===null || telefono_c===undefined){
        telefono_c=0;
    }

    if(email_c==="" || email_c===undefined || email_c===null){
        email_c="";
    }

    console.log("MI CLIENTE:",cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe, cod_user);
    try {
        const sql = 'INSERT INTO clientes (cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe, cod_user) VALUES (?,?,?,?,?,?,?,?)';
        console.log('SQL:',sql)
        const result = await query(sql, [cod_cliente, nombre_c, apellidos_c, direccion_c, telefono_c, email_c, debe, cod_user])
        console.log('result insertClient: ',result)

        res.send({
            error: false,
            data: {cod_cliente},
            message: 'Client successfully added with id ' + result.insert_id
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//OBTENER TOTAL DEL TACO
app.get('/api/v1/pagos/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT * FROM `pagos` WHERE cod_user="+cod_user+" ORDER BY cod_pago DESC";
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

app.post('/api/v1/pago', async(req, res) => {
    console.log("BODY DE PAGO",req.body);
    var { cod_cliente, nombre_c, apellidos_c, cantidad_pago, tipo_pago, cod_user} = req.body;

    if(!cod_cliente || !nombre_c) {
        return res.status(400).send({
            error: true,
            message: 'provide actor first_name and last_name'
        })
    }
    if (cantidad_pago!=0) {
        console.log("MI PAGO:",cod_cliente, nombre_c, apellidos_c, cantidad_pago, tipo_pago);
        try {
            const sql = 'INSERT INTO `pagos`(`cod_cliente_p`, `nombre_c_p`, `apellidos_c_p`, `fecha_pago`, `tipo_de_pago`, `cantidad_pago`, `vista`, `cod_user`) VALUES (?,?,?,CURDATE(),?,?,2,?);';
            console.log('SQL:',sql)
            const result = await query(sql, [cod_cliente, nombre_c, apellidos_c, tipo_pago, cantidad_pago, cod_user])
            console.log('result insertClient: ',result)

            res.send({
                error: false,
                data: {cod_cliente},
                message: 'Client successfully added with id ' + result.insert_id
            })
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    
})

//OBTENER COMPRAS DEL TACO
app.get('/api/v1/compras/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT * FROM `comprasb` WHERE comprasb.cod_user= ? ORDER BY codCom DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//OBTENER COMPRAS DE LA SEMANA
app.get('/api/v1/comprasWeek/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(total) as total FROM `comprasb` WHERE comprasb.cod_user= ? AND vista = 2 ORDER BY codCom DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//OBTENER PAGOS DE LA SEMANA
app.get('/api/v1/pagosWeek/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(cantidad_pago) as total FROM `pagos` WHERE pagos.cod_user= ? AND vista = 2 ORDER BY cod_pago DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//UPDATE VISTA PAGOS, HACER RESET
app.get('/api/v1/resetPays/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "UPDATE `pagos` SET `vista`='3' WHERE cod_user = ?";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//UPDATE VISTA COMPRAS, HACER RESET
app.get('/api/v1/resetBuys/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "UPDATE `comprasb` SET `vista`='3' WHERE cod_user = ?";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

app.post('/api/v1/compra/', async(req, res) => {
    console.log("BODY DE PAGO",req.body);
    var { codArt, codCli, nombreCli, apellidosCli, nombreArt, precio, cantidad, subtotal, total, cod_user} = req.body;


        console.log("MI COMPRA:",req.body);
        try {
            const sql = 'INSERT INTO `comprasb`(`codArt`, `codCli`, `nombreCli`, `apellidosCli`, `nombreArt`, `precio`, `cantidad`, `subtotal`, `total`, `fechaCom`, `vista`, `cod_user`) VALUES (?,?,?,?,?,?,?,?,?,CURDATE(),2,?)';
            console.log('SQL:',sql)
            const result = await query(sql, [codArt, codCli, nombreCli, apellidosCli, nombreArt, precio, cantidad, subtotal, total, cod_user])
            console.log('result insertClient: ',result)

            res.send({
                error: false,
                data: {total},
                message: 'Client successfully added with id ' + result.insert_id
            })
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    
})

//Delete client by id
app.delete('/api/v1/pay/:cod_pago/:cod_user', async(req, res) => {
    const { cod_pago, cod_user} = req.params;

    if(!cod_pago){
        res.status(400).send({ 
            error: true,
            message: 'provide pay id',

        })
    }
    try {
        const sql = "DELETE FROM pagos WHERE cod_pago = ? AND cod_user = ?";
        const result = await query(sql, [cod_pago, cod_user]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Pay is not found';
        }else{
            message = 'Pay successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/buy/:cod_compra/:cod_user', async(req, res) => {
    const { cod_compra, cod_user} = req.params;

    if(!cod_compra){
        res.status(400).send({ 
            error: true,
            message: 'provide buy id',

        })
    }
    try {
        const sql = "DELETE FROM comprasb WHERE codCom = ? AND cod_user = ?";
        const result = await query(sql, [cod_compra, cod_user]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Buy is not found';
        }else{
            message = 'Buy successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})
module.exports = { runServer, stopServer };
