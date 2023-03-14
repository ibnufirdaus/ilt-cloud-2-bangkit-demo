const Hapi = require('@hapi/hapi')
const contacts = require('./contacts')

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    server.route([

    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
})();