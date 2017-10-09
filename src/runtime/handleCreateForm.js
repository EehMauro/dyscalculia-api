import uid from 'uid';
import moment from 'moment';
import { putItem } from '../persistence';
import { FORMS_TABLE } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;
  const formData = req.body;

  bunyan.info('[CREATE-FORM] received');

  try {

    let form = {
      id: uid(10),
      ts: +moment().format('X'),
      email: formData.email,
      age: formData.age,
      gender: formData.gender,
      educationLevel: formData.educationLevel,
      comment: formData.comment,
      questions: formData.questions.map(question => ({
        id: question.id,
        answer: question.answer,
        isCorrect: question.isCorrect,
        completionTime: question.completionTime
      })),
      requestInfo: {
        remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      },
      answeredQuestionsAmount: formData.questions.filter(q => q.answer).length,
      correctQuestionsAmount: formData.questions.filter(q => q.isCorrect).length,
      totalCompletionTime: formData.questions.map(q => q.completionTime).reduce((a, b) => a + b, 0)
    };

    let params = {
      TableName: FORMS_TABLE,
      Item: form,
      Key: { id: form.id }
    };

    await putItem(params, dynamoClient);

    bunyan.info('[CREATE-FORM] success', { id: form.id });

    res.send(200, { success: true });

  } catch (error) {

    bunyan.error('[CREATE-FORM] error', error);

    res.send(500);

  }

}
