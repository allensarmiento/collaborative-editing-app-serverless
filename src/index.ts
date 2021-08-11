import { app } from './app';

const start = async () => {

  const port = process.env.PORT || 4000;
  app.listen(4000, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
