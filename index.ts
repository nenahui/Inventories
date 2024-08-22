import express from 'express';
import mysqlDb from './mysqlDb';
import { categoriesRouter } from './routers/categories';
import { itemsRouter } from './routers/items';
import { locationsRouter } from './routers/locations';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/items', itemsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

run().catch((err) => {
  console.error(err);
});
