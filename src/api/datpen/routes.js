const routes = (handler) => [
  {
    method: 'POST',
    path: '/datpen',
    handler: (request, h) => handler.postDatpenHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        // maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/datpen',
    handler: (request, h) => handler.getDatpenHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/datpen/{id}',
    handler: (request, h) => handler.deleteDatpenHandler(request, h),
  },
];

module.exports = routes;
