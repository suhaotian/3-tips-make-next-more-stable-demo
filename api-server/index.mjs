import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/messages', (req, res) => {
  const isEven = Math.round(Math.random() * 23) % 2 === 0;
  if (isEven) {
    res.send([
      { id: 1, text: 'Foobar' },
      { id: 1, text: 'Some content' },
    ]);
  } else {
    res.status(500).send({
      msg: 'some error happend',
    });
  }
});

app.listen(3068, () => {
  console.log(`Server listening at: http://127.0.0.1:3068`);
});
