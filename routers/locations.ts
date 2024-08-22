import express from 'express';
import multer from 'multer';
import type { ResultSetHeader } from 'mysql2';
import mysqlDb from '../mysqlDb';
import type { Location, LocationMutation } from '../types';

const upload = multer();

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

locationsRouter.post('/', upload.none(), async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).send({
        error: 'Name is required',
      });
    }

    const newLocation: LocationMutation = {
      name: body.name,
      description: body.description ? body.description : null,
    };

    const insertResult = await mysqlDb
      .getConnection()
      .query('insert into locations (name, description) values (?, ?);', [newLocation.name, newLocation.description]);

    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb
      .getConnection()
      .query('select * from locations where id = ?;', [resultHeader.insertId]);
    const locations = getNewResult[0] as Location[];

    return res.send(locations[0]);
  } catch (e) {
    next(e);
  }
});

locationsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await mysqlDb.getConnection().query('select * from locations where id = ?;', [id]);
    const locations = result[0] as Location[];

    if (locations.length === 0) {
      return res.status(404).send({
        error: 'Location not found',
      });
    }

    const related = await mysqlDb.getConnection().query('select * from items where location_id = ?;', [id]);
    const relatedResult = related[0] as Location[];

    if (relatedResult.length > 0) {
      return res.status(400).send({
        error: 'The location cannot be deleted because it is used by items',
      });
    }

    await mysqlDb.getConnection().query('delete from locations where id = ?;', [id]);

    return res.status(200).send({
      message: 'Location deleted successfully',
    });
  } catch (e) {
    next(e);
  }
});

locationsRouter.put('/:id', upload.none(), async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const find = await mysqlDb.getConnection().query('select * from locations where id = ?;', [id]);
    const findResult = find[0] as Location[];

    if (findResult.length === 0) {
      return res.status(404).send({
        error: 'Category not found',
      });
    }

    const updatedLocation: LocationMutation = {
      name: body.name ? body.name : findResult[0].name,
      description: body.description ? body.description : findResult[0].description,
    };

    await mysqlDb
      .getConnection()
      .query('update locations set name = ?, description = ? where id = ?;', [
        updatedLocation.name,
        updatedLocation.description,
        id,
      ]);
    const newLocation = await mysqlDb.getConnection().query('select * from locations where id = ?;', [id]);
    const result = newLocation[0] as Location[];

    return res.send(result[0]);
  } catch (e) {
    next(e);
  }
});
