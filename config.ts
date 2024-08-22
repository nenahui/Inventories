import path from 'node:path';

export const config = {
  publicPath: path.join(__dirname, 'public'),

  database: {
    host: 'localhost',
    user: 'root',
    password: 'pridumal',
    database: 'inventory',
  },
};
