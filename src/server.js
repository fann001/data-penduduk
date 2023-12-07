require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const cloudinary = require('cloudinary');
// const { google } = require('googleapis');

const datpen = require('./api/datpen');
const DatpenService = require('./service/postgresql/DatpenService');
const DatpenValidator = require('./validator/datpen');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const datpenService = new DatpenService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  cloudinary.config({
    cloud_name: process.env.CLOUD_IMAGE_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  await server.register([
    {
      plugin: Inert,
    },
  ]);

  await server.register([
    {
      plugin: datpen,
      options: {
        service: datpenService,
        validator: DatpenValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    // console.log(response);
    if (response instanceof Error) {
      console.log(response);
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
