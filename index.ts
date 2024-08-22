import express from 'express';
import mysqlDb from './mysqlDb';
import { inventoriesRouter } from './routers/inventories';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/inventories', inventoriesRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

run().catch((err) => {
  console.error(err);
});
