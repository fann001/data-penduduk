/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('datpen', {
    id: {
      type: 'VARCHAR(22)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    region: {
      type: 'TEXT',
      notNull: true,
    },
    rt: {
      type: 'INTEGER',
      notNull: true,
    },
    rw: {
      type: 'INTEGER',
      notNull: true,
    },
    call: {
      type: 'TEXT',
      notNull: false,
    },
    image_url: {
      type: 'TEXT',
      notNull: true,
    },
    public_id: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('datpen');
};
