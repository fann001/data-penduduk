/* eslint-disable no-underscore-dangle */
class DatpenHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postDatpenHandler(request, h) {
    const {
      name, call, rt, rw, region, image,
    } = request.payload;

    this.validator.validateDatpenPayload({
      name, call, rt, rw, region, ...image.hapi.headers,
    });

    const datpenId = await this.service.addDatpen({
      name, call, rt, rw, region, image,
    });

    const response = h.response({
      status: 'succes',
      message: 'Data berhasil ditambahkan',
      data: {
        datpenId,
      },
    });
    response.code(201);
    return response;
  }

  async getDatpenHandler(request) {
    const { name, region } = request.query;
    const datpen = await this.service.getDatpen(name, region);
    return {
      status: 'succes',
      data: {
        datpen,
      },
    };
  }

  async deleteDatpenHandler(request) {
    const { id } = request.params;
    await this.service.deleteDatpen(id);
    return {
      status: 'succes',
      message: 'Data berhasil dihapus',
    };
  }
}

module.exports = DatpenHandler;
