import express from 'express';
import mysqlDb from '../mysqlDb';
import type { Items } from '../types';

export const inventoriesRouter = express.Router();

inventoriesRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('select * from items;');
    const items = result[0] as Items[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

inventoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('select * from items where id = ?;', [id]);
    const items = result[0] as Items[];

    if (items.length === 0) {
      return res.status(404).send({
        error: 'Item not found',
      });
    }

    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});
