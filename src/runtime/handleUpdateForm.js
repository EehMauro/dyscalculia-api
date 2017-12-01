import { putItem, getItem } from '../persistence';
import { FORMS_TABLE } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;
  const { email } = req.token;
  const { question, comment, triedMoravec, finished } = req.body;

  bunyan.info('[UPDATE-FORM] received');

  try {

    let form = await getItem({ TableName: FORMS_TABLE, Key: { email } }, dynamoClient);

    if (!form) throw 'form not exists';

    let questions = form.questions;

    if (question) {
      questions.push({
        id: question.id,
        answer: question.answer,
        isCorrect: question.isCorrect,
        completionTime: question.completionTime
      });
    }

    let params = {
      TableName: FORMS_TABLE,
      Item: {
        ...form,
        questions: questions,
        comment: comment ? comment : null,
        triedMoravec: triedMoravec !== undefined ? triedMoravec : null,
        answeredQuestionsAmount: questions.filter(q => q.answer !== null).length,
        correctQuestionsAmount: questions.filter(q => q.isCorrect).length,
        totalCompletionTime: finished ? questions.map(q => q.completionTime).reduce((a, b) => a + b, 0) : null,
        isFinished: !!finished
      },
      Key: { email }
    };

    await putItem(params, dynamoClient);

    bunyan.info('[UPDATE-FORM] success', { email });

    res.send(200, { success: true });

  } catch (error) {

    bunyan.error('[UPDATE-FORM] error', error);

    res.send(500);

  }

}
