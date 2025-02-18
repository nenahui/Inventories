import express from 'express';
import type { ResultSetHeader } from 'mysql2';
import { imagesUpload } from '../multer';
import mysqlDb from '../mysqlDb';
import type { Item, ItemMutation } from '../types';

export const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('select * from items;');
    const items = result[0] as Item[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('select * from items where id = ?;', [id]);
    const items = result[0] as Item[];

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

itemsRouter.post('/', imagesUpload.single('photo'), async (req, res, next) => {
  try {
    const body = req.body;
    const file = req.file;

    if (!body.category_id || !body.location_id || !body.name) {
      return res.status(400).send({
        error: 'Category, location and name fields are required',
      });
    }

    const item: ItemMutation = {
      name: body.name,
      category_id: parseFloat(body.category_id),
      location_id: parseFloat(body.location_id),
      description: body.description ? body.description : null,
      photo: file ? file.filename : null,
    };

    const insertResult = await mysqlDb
      .getConnection()
      .query('insert into items (name, category_id, location_id, description, photo) values(?, ?, ?, ?, ?);', [
        item.name,
        item.category_id,
        item.location_id,
        item.description,
        item.photo,
      ]);
    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb
      .getConnection()
      .query('select * from items where id = ?;', [resultHeader.insertId]);
    const products = getNewResult[0] as Item[];

    return res.send(products[0]);
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await mysqlDb.getConnection().query('select * from items where id = ?;', [id]);
    const findResult = item[0] as Item[];

    if (findResult.length === 0) {
      return res.status(404).send({
        error: 'Item not found',
      });
    }

    await mysqlDb.getConnection().query('delete from items where id = ?;', [id]);

    return res.send(item[0]);
  } catch (e) {
    next(e);
  }
});

itemsRouter.put('/:id', imagesUpload.single('photo'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const file = req.file;

    const findItem = await mysqlDb.getConnection().query('select * from items where id = ?;', [id]);
    const findResult = findItem[0] as Item[];

    if (findResult.length === 0) {
      return res.status(404).send({
        error: 'Item not found',
      });
    }

    const updatedItem: ItemMutation = {
      name: body.name ? body.name : findResult[0].name,
      category_id: body.category_id ? parseFloat(body.category_id) : findResult[0].category_id,
      location_id: body.location_id ? parseFloat(body.location_id) : findResult[0].location_id,
      description: body.description ? body.description : findResult[0].description,
      photo: file ? file.filename : findResult[0].photo,
    };

    await mysqlDb
      .getConnection()
      .query('UPDATE items SET name = ?, category_id = ?, location_id = ?, description = ?, photo = ? WHERE id = ?;', [
        updatedItem.name,
        updatedItem.category_id,
        updatedItem.location_id,
        updatedItem.description,
        updatedItem.photo,
        id,
      ]);

    const newItem = await mysqlDb.getConnection().query('select * from items where id = ?;', [id]);

    return res.send(newItem[0]);
  } catch (e) {
    next(e);
  }
});
