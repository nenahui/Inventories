import express from 'express';
import type { ResultSetHeader } from 'mysql2';
import mysqlDb from '../mysqlDb';
import type { Category, CategoryMutation } from '../types';

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

categoriesRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).send({
        error: 'Name is required',
      });
    }

    const newCategory: CategoryMutation = {
      name: body.name,
      description: body.description ? body.description : null,
    };

    const insertResult = await mysqlDb
      .getConnection()
      .query('insert into categories (name, description) values (?, ?);', [newCategory.name, newCategory.description]);

    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb
      .getConnection()
      .query('select * from categories where id = ?;', [resultHeader.insertId]);
    const categories = getNewResult[0] as Location[];

    return res.send(categories[0]);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await mysqlDb.getConnection().query('select * from categories where id = ?;', [id]);
    const categories = result[0] as Category[];

    if (categories.length === 0) {
      return res.status(404).send({
        error: 'Category not found',
      });
    }

    const related = await mysqlDb.getConnection().query('select * from items where category_id = ?;', [id]);
    const relatedResult = related[0] as Category[];

    if (relatedResult.length > 0) {
      return res.status(400).send({
        error: 'The category cannot be deleted because it is used by items',
      });
    }

    await mysqlDb.getConnection().query('delete from categories where id = ?;', [id]);

    return res.status(200).send({
      message: 'Category deleted successfully',
    });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const find = await mysqlDb.getConnection().query('select * from categories where id = ?;', [id]);
    const findResult = find[0] as Category[];

    if (findResult.length === 0) {
      return res.status(404).send({
        error: 'Category not found',
      });
    }

    const updatedCategory: CategoryMutation = {
      name: body.name ? body.name : findResult[0].name,
      description: body.description ? body.description : findResult[0].description,
    };

    await mysqlDb
      .getConnection()
      .query('update categories set name = ?, description = ? where id = ?;', [
        updatedCategory.name,
        updatedCategory.description,
        id,
      ]);
    const newCategory = await mysqlDb.getConnection().query('select * from categories where id = ?;', [id]);
    const result = newCategory[0] as Category[];

    return res.send(result[0]);
  } catch (e) {
    next(e);
  }
});
