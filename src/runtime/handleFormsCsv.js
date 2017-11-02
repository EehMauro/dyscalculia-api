import moment from 'moment';
import json2csv from 'json2csv';
import { scanItems } from '../persistence';
import { FORMS_TABLE, questions } from '../conventions';

function mapQuestions (questions) {
  let data = {};
  for (let i = 0; i < questions.length; i++) {
    data[`${ questions[i].id.toUpperCase() }_CORRECTA`] = questions[i].isCorrect ? 1 : 0;
    data[`${ questions[i].id.toUpperCase() }_RESPUESTA`] = questions[i].answer;
    data[`${ questions[i].id.toUpperCase() }_TIEMPO`] = questions[i].completionTime;
  }
  return data;
}

function getQuestions (forms) {
  let questionLabels = [];
  for (let i = 0; i < questions.length; i++) {
    questionLabels.push(
      `${ questions[i].id.toUpperCase() }_CORRECTA`,
      `${ questions[i].id.toUpperCase() }_RESPUESTA`,
      `${ questions[i].id.toUpperCase() }_TIEMPO`
    );
  };
  let csvData = json2csv({
    fields: [
      { label: 'ID', value: 'id' },
      ...questionLabels
    ],
    data: forms.map(form => ({
      id: form.id,
      ...mapQuestions(form.questions)
    }))
  });
  return csvData;
}

function getData (forms) {
  let csvData = json2csv({
    fields: [
      { label: 'ID', value: 'id' },
      { label: 'FECHA', value: 'ts' },
      { label: 'EMAIL', value: 'email' },
      { label: 'EDAD', value: 'age' },
      { label: 'GENERO', value: 'gender' },
      { label: 'EDUCACION', value: 'educationLevel' },
      { label: 'USO_MORAVEC', value: 'triedMoravec' },
      { label: 'FORMULARIO_COMPLETO', value: 'isFinished' },
      { label: 'PREGUNTAS_CONTESTADAS', value: 'answeredQuestionsAmount' },
      { label: 'PREGUNTAS_CORRECTAS', value: 'correctQuestionsAmount' },
      { label: 'TIEMPO_TOTAL', value: 'totalCompletionTime' },
      { label: 'COMENTARIO', value: 'comment' }
    ],
    data: forms.map(form => ({
      id: form.id,
      ts: moment(form.ts, 'X').format('DD/MM/YYYY HH:mm'),
      email: form.email,
      age: form.age || '',
      gender: form.gender || '',
      educationLevel: form.educationLevel || '',
      triedMoravec: form.triedMoravec || '',
      comment: form.comment ? form.comment.replace(/,/g, ';') : '',
      isFinished: form.isFinished ? 'Si' : 'No',
      answeredQuestionsAmount: form.answeredQuestionsAmount,
      correctQuestionsAmount: form.correctQuestionsAmount,
      totalCompletionTime: form.totalCompletionTime || ''
    }))
  });
  return csvData;
}

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;

  let { fromDate, toDate, type } = req.params;

  bunyan.info('[FORMS-CSV] received');

  try {

    let FilterExpression = '';
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};

    if (fromDate) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#ts >= :fromDate';
      ExpressionAttributeNames['#ts'] = 'ts';
      ExpressionAttributeValues[':fromDate'] = fromDate;
    }

    if (toDate) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#ts <= :toDate';
      ExpressionAttributeNames['#ts'] = 'ts';
      ExpressionAttributeValues[':toDate'] = toDate;
    }

    let params = {
      TableName: FORMS_TABLE,
      FilterExpression: FilterExpression !== '' ? FilterExpression : undefined,
      ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length ? ExpressionAttributeNames : undefined,
      ExpressionAttributeValues: Object.keys(ExpressionAttributeValues).length ? ExpressionAttributeValues : undefined
    };

    let { results } = await scanItems(params, dynamoClient);

    bunyan.info('[FORMS-CSV] success', { results: results.length });

    let csvData = type === 'data' ? getData(results) : getQuestions(results);

    res.set({ 'Content-Disposition': `attachment; filename='${ type }.csv'` });
    res.setHeader('Content-type', 'text/csv');
    res.send(csvData);

  } catch (error) {

    bunyan.error('[FORMS-CSV] error', error);

    res.send(500);

  }

}
