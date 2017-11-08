import { describeTable } from '../persistence';
import { FORMS_TABLE } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoDB } = state;

  bunyan.info('[COUNT-FORMS] received');

  try {

    let response = await describeTable({ TableName: FORMS_TABLE }, dynamoDB);

    bunyan.info('[COUNT-FORMS] success');

    res.send(200, { count: response.Table.ItemCount });

  } catch (error) {

    bunyan.error('[COUNT-FORMS] error', error);

    res.send(500);

  }

}
