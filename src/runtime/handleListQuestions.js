import shuffle from 'shuffle-array';
import { questions } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan } = state;

  bunyan.info('[LIST-QUESTIONS] received');

  const results = shuffle(questions);

  bunyan.info('[LIST-QUESTIONS] success', { results: results.length });

  res.send(200, { results });
  
}
