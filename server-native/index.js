const http = require('http');
const contacts = require("./contacts");

(async () => {
    const server = http.createServer((request, response) => {
        // manually set content-type
        response.setHeader('Content-Type', 'application/json');

        // get url path and request method
        const { url, method } = request;

        if (url === '/contacts') {

            // CREATE CONTACT
            if (method === 'POST') {

                // retrieve payload
                let body = '';
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });

                request.on('end', () => {

                    // get data
                    const { name, email, phone  } = JSON.parse(body);
                    const id = contacts[contacts.length - 1].id + 1;

                    // save into 'database'
                    contacts.push({ id, name, email, phone });

                    // send response with custom statusCode
                    response.statusCode = 201;
                    return response.end(JSON.stringify({ message: 'Contact added successfully' }));
                });
            }

            // GET CONTACT LIST
            if (method === 'GET') {
                return response.end(JSON.stringify(contacts));
            }
        }

        // DELETE CONTACT
        // we have to use startsWith since delete url path is typically formed like /contacts/1
        if (url.startsWith('/contacts/')) {

            if (method === 'DELETE') {

                // retrieve user id by splitting the url path
                const id = request.url.split('/')[2];

                const user = contacts.find(user => user.id === parseInt(id));

                if (user) {
                    const index = contacts.indexOf(user);
                    contacts.splice(index, 1);

                    response.statusCode = 200;
                    return response.end(JSON.stringify({ message: 'Contact deleted successfully' }));
                }

                response.statusCode = 404;
                return response.end(JSON.stringify({ message: 'Contact not found' }));
            }
        }
    });

    server.listen(3000, 'localhost', () => {
        console.log('Server running on http://localhost:3000');
    });
})();
