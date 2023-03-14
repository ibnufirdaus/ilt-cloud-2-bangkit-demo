const Hapi = require('@hapi/hapi');
const contacts = require('./contacts');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    server.route([
        {
            method: 'POST',
            path: '/contacts',
            handler: (request, h) => {
                const {name, email, phone} = request.payload;
                const id = contacts[contacts.length - 1].id + 1;

                contacts.push(
                    {id, name, email, phone}
                );

                const response = h.response({message: 'Contact is successfully created'});
                response.code(201);
                return response;
            }
        },
        {
            method: 'GET',
            path: '/contacts',
            handler: () => contacts,
        },
        {
            method: 'DELETE',
            path: '/contacts/{id}',
            handler: (request, h) => {
                const { id } = request.params;
                const index = contacts.findIndex(
                    contact => contact.id === parseInt(id)
                );

                if (index === -1) {
                    const response = h.response({message: 'Contact not found!'});
                    response.code(404);
                    return response;
                }

                contacts.splice(index, 1);

                return { message: 'Contact is successfully deleted'};
            }
        },
        {
            method: 'PUT',
            path: '/contacts/{id}',
            handler: (request, h) => {
                const { id } = request.params;
                const {name, email, phone} = request.payload;

                const index = contacts.findIndex(
                    contact => contact.id === parseInt(id)
                );

                if (index === -1) {
                    const response = h.response({message: 'Contact not found!'});
                    response.code(404);
                    return response;
                }

                contacts[index] = {id, name, email, phone};

                return { message: 'Contact is successfully updated'}
            }
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
})();