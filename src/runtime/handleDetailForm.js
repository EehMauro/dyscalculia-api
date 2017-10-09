import { getItem } from '../persistence';
import { FORMS_TABLE, questions } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;
  const formId = req.params.id;

  bunyan.info('[DETAIL-FORM] received');

  try {

    if (!formId) throw 'missing formId parameter';

    let form = await getItem({ TableName: FORMS_TABLE, Key: { id: formId } }, dynamoClient);

    if (!form) throw 'form not exists';

    form.questions = form.questions.map(question => ({ ...questions.find(q => q.id === question.id), ...question }));

    bunyan.info('[DETAIL-FORM] success', { id: form.id });

    res.send(200, form);

  } catch (error) {

    bunyan.error('[DETAIL-FORM] error', error);

    res.send(500);

  }

}
