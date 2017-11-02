import moment from 'moment';
import json2csv from 'json2csv';
import { scanItems } from '../persistence';
import { FORMS_TABLE, questions } from '../conventions';

function mapQuestions (questions) {
  let data = {};
  for (let i = 0; i < questions.length; i++) {
    data[`q${ i }IsCorrect`] = questions[i].isCorrect ? 'Si' : 'No';
    data[`q${ i }Answer`] = questions[i].answer;
    data[`q${ i }CompletionTime`] = questions[i].completionTime;
  }
  return data;
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

    let questionLabels = [];
    for (let i = 0; i < questions.length; i++) {
      questionLabels.push(
        { label: `P${ i+1 } es correcta`, value: `q${ i }IsCorrect` },
        { label: `P${ i+1 } respuesta`, value: `q${ i }Answer` },
        { label: `P${ i+1 } tiempo`, value: `q${ i }CompletionTime` }
      );
    };

    let csvData = json2csv({
      fields: [
        { label: 'Fecha', value: 'ts' },
        { label: 'Email', value: 'email' },
        { label: 'Edad', value: 'age' },
        { label: 'Sexo', value: 'gender' },
        { label: 'Nivel de educacion', value: 'educationLevel' },
        { label: 'Uso Moravec', value: 'triedMoravec' },
        { label: 'Formulario completado', value: 'isFinished' },
        { label: 'Preguntas contestadas', value: 'answeredQuestionsAmount' },
        { label: 'Preguntas correctas', value: 'correctQuestionsAmount' },
        { label: 'Tiempo total (seg)', value: 'totalCompletionTime' },
        ...questionLabels,
        { label: 'Comentario', value: 'comment' }
      ],
      data: results.map(form => ({
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
        totalCompletionTime: form.totalCompletionTime || '',
        ...mapQuestions(form.questions)
      }))
    })

    res.set({ "Content-Disposition": "attachment; filename='data.csv'" });
    res.setHeader("Content-type", "text/csv");
    res.send(csvData);

  } catch (error) {

    bunyan.error('[FORMS-CSV] error', error);

    res.send(500);

  }

}
