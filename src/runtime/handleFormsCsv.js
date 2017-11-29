import moment from 'moment';
import json2csv from 'json2csv';
import { scanItems } from '../persistence';
import { FORMS_TABLE, questions } from '../conventions';

function mapQuestions (form) {
  let data = {};
  for (let question of questions) {
    let questionId = question.id.toUpperCase();
    let q = form.questions.find(q => q.id === question.id);
    if (!q) {
      data[`${ questionId }_CORRECTA`] = 0;
      data[`${ questionId }_RESPUESTA`] = -999;
      data[`${ questionId }_TIEMPO`] = -999;
    } else {
      let { isCorrect, completionTime, answer } = q;
      data[`${ questionId }_CORRECTA`] = isCorrect ? 1 : 0;
      data[`${ questionId }_TIEMPO`] = completionTime || -999;
      data[`${ questionId }_RESPUESTA`] = question.options.indexOf(answer) + 1;
    }
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
    excelStrings: true,
    del: ';',
    fields: [
      { label: 'ID', value: 'id' },
      ...questionLabels
    ],
    data: forms.sort((f1, f2) => f1.ts - f2.ts).map(form => ({
      id: form.id,
      ...mapQuestions(form)
    }))
  });
  return csvData;
}

function getGenderValue (gender) {
  switch (gender) {
    case 'female': return 1;
    case 'male': return 2;
    case 'other': return 3;
    default: return -999;
  }
}

function getEducationValue (education) {
  switch (education) {
    case 'none': return 1;
    case 'primary': return 2;
    case 'high-school': return 3;
    case 'academic': return 4;
    case 'postgraduate': return 5;
    default: return -999;
  }
}

function getData (forms) {
  let csvData = json2csv({
    excelStrings: true,
    del: ';',
    fields: [
      { label: 'ID', value: 'id' },
      { label: 'FECHA', value: 'ts' },
      { label: 'EMAIL', value: 'email' },
      { label: 'EDAD', value: 'age' },
      { label: 'GENERO', value: 'gender' },
      { label: 'EDUCACION', value: 'educationLevel' },
      { label: 'DISPOSITIVO', value: 'deviceType' },
      { label: 'USO_MORAVEC', value: 'triedMoravec' },
      { label: 'FORMULARIO_COMPLETO', value: 'isFinished' },
      { label: 'PREGUNTAS_CONTESTADAS', value: 'answeredQuestionsAmount' },
      { label: 'PREGUNTAS_CORRECTAS', value: 'correctQuestionsAmount' },
      { label: 'TIEMPO_TOTAL', value: 'totalCompletionTime' },
      { label: 'COMENTARIO', value: 'comment' }
    ],
    data: forms.sort((f1, f2) => f1.ts - f2.ts).map(form => ({
      id: form.id,
      ts: moment(form.ts, 'X').utcOffset("-03:00").format('DD/MM/YYYY HH:mm'),
      email: form.email,
      age: form.age || -999,
      gender: getGenderValue(form.gender),
      educationLevel: getEducationValue(form.educationLevel),
      deviceType: form.deviceType === 'desktop' ? 1 : 2,
      triedMoravec: form.triedMoravec ? 1 : 0,
      comment: form.comment ? form.comment.replace(/;/g, ',') : '',
      isFinished: form.isFinished ? 1 : 0,
      answeredQuestionsAmount: form.answeredQuestionsAmount || -999,
      correctQuestionsAmount: form.correctQuestionsAmount || -999,
      totalCompletionTime: form.totalCompletionTime || -999
    }))
  });
  return csvData;
}

function getQuestionsSpecifications () {
  let csvData = json2csv({
    excelStrings: true,
    del: ';',
    fields: [
      { label: 'ID', value: 'id' },
      { label: 'PREGUNTA', value: 'label' },
      { label: '1', value: 'opt1' },
      { label: '2', value: 'opt2' },
      { label: '3', value: 'opt3' },
      { label: 'CORRECTA', value: 'correct' }
    ],
    data: questions.map(question => {  
      let record = {
        id: question.id.toUpperCase(),
        label: question.label,
        opt1: '',
        opt2: '',
        opt3: '',
        correct: '',
      };
      if (question.type === 'multiple-choice-question') {
        for (let i = 0; i < question.options.length; i++) {
          record[`opt${ i+1 }`] = question.options[i];
        }
        record.correct = question.options.indexOf(question.correctAnswer) + 1;
      }
      if (question.type === 'image-multiple-choice-question') {
        for (let i = 0; i < question.options.length; i++) {
          record[`opt${ i+1 }`] = i + 1;
        }
        record.correct = question.correctAnswer + 1;
      }
      return record;
    })
  });
  return csvData;
}

function getDataSpecifications () {
  let csvData = json2csv({
    excelStrings: true,
    del: ';',
    fields: [
      { label: 'CAMPO', value: 'field' },
      { label: 'OPCION', value: 'option' },
      { label: 'VALOR', value: 'value' }
    ],
    data: [
      { field: 'GENERO', option: '1', value: 'Mujer' },
      { field: 'GENERO', option: '2', value: 'Varón' },
      { field: 'GENERO', option: '3', value: 'Otro' },
      { field: 'EDUCACION', option: '1', value: 'Ninguno' },
      { field: 'EDUCACION', option: '2', value: 'Primario' },
      { field: 'EDUCACION', option: '3', value: 'Secundario' },
      { field: 'EDUCACION', option: '4', value: 'Terciario / Universitario' },
      { field: 'EDUCACION', option: '5', value: 'Posgrado' },
      { field: 'DISPOSITIVO', option: '1', value: 'PC / Mac' },
      { field: 'DISPOSITIVO', option: '2', value: 'Celular / Tablet' },
    ]
  });
  return csvData;
}

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;

  let { type } = req.params;

  bunyan.info('[FORMS-CSV] received');

  try {

    let csvData = null;

    if (type.indexOf('specification') === -1) {


      let forms = [], lastKey = undefined;

      do {

        let params = { TableName: FORMS_TABLE, ExclusiveStartKey: lastKey };

        let { results, lastKey: newLastKey } = await scanItems(params, dynamoClient);

        lastKey = newLastKey;

        forms.push(...results);

      } while (lastKey);

      csvData = type === 'alldata' ? getData(forms) : getQuestions(forms);

    } else {

      if (type === 'questions-specification')  csvData = getQuestionsSpecifications();

      if (type === 'data-specification')  csvData = getDataSpecifications();

    }

    bunyan.info('[FORMS-CSV] success');

    res.set({ 'Content-Disposition': `attachment; filename='${ type }.csv'` });
    res.setHeader('Content-type', 'text/csv; charset=UTF-8');
    res.send(csvData);

  } catch (error) {

    bunyan.error('[FORMS-CSV] error', error);

    res.send(500);

  }

}
