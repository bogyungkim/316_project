import 'dotenv/config';
import express from 'express';
import cors from 'cors'

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));
