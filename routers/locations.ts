import express from 'express';
import mysqlDb from '../mysqlDb';
import type { Location } from '../types';

export const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('select * from locations;');
    const items = result[0] as Location[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

locationsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('select * from locations where id = ?;', [id]);
    const items = result[0] as Location[];

    if (items.length === 0) {
      return res.status(404).send({
        error: 'Location not found',
      });
    }

    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});
