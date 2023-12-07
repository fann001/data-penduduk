/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const cloudinary = require('../../api/datpen/cloudinary');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class DatpenService {
  constructor() {
    this.pool = new Pool();
  }

  async addDatpen({
    name, region, rt, rw, call, image,
  }) {
    const id = `datpen-${nanoid(15)}`;

    const image_upload = await new Promise((resolve) => {
      cloudinary.v2.uploader.upload_stream((error, uploadResult) => resolve(uploadResult))
        .end(image._data);
    });

    const image_url = image_upload.url;
    const public_id = image_upload.public_id;

    const query = {
      text: 'INSERT INTO datpen VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, name, region, rt, rw, call, image_url, public_id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Data gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getDatpen(name, region) {
    let result;

    if (region !== undefined) {
      result = await this.pool.query(`SELECT name, region, rt, rw, call, image_url FROM datpen WHERE region LIKE '%${region}%'`);
    }

    if (name !== undefined) {
      result = await this.pool.query(`SELECT name, region, rt, rw, call, image_url FROM datpen WHERE name LIKE '%${name}%'`);
    }

    if (!result.rows.length) {
      throw new NotFoundError('Data tidak ditemukan');
    }

    return result.rows;
  }

  async deleteDatpen(id) {
    const queryPublic_id = {
      text: 'SELECT public_id FROM datpen WHERE id = $1',
      values: [id],
    };

    const resultPublic_id = await this.pool.query(queryPublic_id);
    const { public_id } = resultPublic_id.rows[0];

    cloudinary.uploader
      .destroy(`${public_id}`)
      .then((result) => console.log(result));

    const query = {
      text: 'DELETE FROM datpen WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data tidak ditemukan');
    }
  }
}

module.exports = DatpenService;
