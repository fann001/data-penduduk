const DatpenHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'datpen',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const datpenHandler = new DatpenHandler(service, validator);
    server.route(routes(datpenHandler));
  },
};
