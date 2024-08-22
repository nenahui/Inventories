import express from 'express';
import mysqlDb from '../mysqlDb';
import type { Category } from '../types';

export const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('select * from categories;');
    const items = result[0] as Category[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('select * from categories where id = ?;', [id]);
    const items = result[0] as Category[];

    if (items.length === 0) {
      return res.status(404).send({
        error: 'Category not found',
      });
    }

    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});
