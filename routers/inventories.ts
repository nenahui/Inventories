import express from 'express';
import type { ResultSetHeader } from 'mysql2';
import { imagesUpload } from '../multer';
import mysqlDb from '../mysqlDb';
import type { Item, ItemMutation } from '../types';

export const inventoriesRouter = express.Router();

inventoriesRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('select * from items;');
    const items = result[0] as Item[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

inventoriesRouter.get('/:id', async (req, res, next) => {
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

inventoriesRouter.post('/', imagesUpload.single('photo'), async (req, res, next) => {
  try {
    const body = req.body;
    const file = req.file;

    if (!body.category || !body.location || !body.name) {
      return res.status(400).send({
        error: 'Category, location and name fields are required',
      });
    }

    const item: ItemMutation = {
      name: body.name,
      category: parseFloat(body.category),
      location: parseFloat(body.location),
      description: body.description ? body.description : null,
      photo: file ? file.filename : null,
    };

    const insertResult = await mysqlDb
      .getConnection()
      .query('insert into items (name, category, location, description, photo) values(?, ?, ?, ?, ?);', [
        item.name,
        item.category,
        item.location,
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
