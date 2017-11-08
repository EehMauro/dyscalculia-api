import { scanItems } from '../persistence';
import { FORMS_TABLE } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;

  let { limit, lastKey } = req.query;

  bunyan.info('[LIST-FORMS] received');

  try {

    let params = {
      TableName: FORMS_TABLE,
      ExclusiveStartKey: lastKey ? { email: lastKey } : undefined,
      Limit: limit
    };

    let { results, lastKey: newLastKey } = await scanItems(params, dynamoClient);

    bunyan.info('[LIST-FORMS] success', { results: results.length });

    res.send(200, { results, lastKey: newLastKey ? newLastKey.email : null });

  } catch (error) {

    bunyan.error('[LIST-FORMS] error', error);

    res.send(500);

  }

}
