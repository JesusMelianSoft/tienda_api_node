const { runServer, stopServer } = require('./server/server');

const mysql = require('mysql');

const startAplication = () => {
    console.log('Aplication is running');
    runServer();
}

const stopAplication = () => {
    console.log('Receibed kill signal, shutting down');
    stopServer();
    process.exit(0);
}

// Listen signal CTRL-C controla el evento de pulsar CTRl-C
process.on('SIGINT', () => stopAplication());

// Listen signal CTRL-D Kill controla el evento KILL
process.on('SIGTERM', () => stopAplication());

startAplication();