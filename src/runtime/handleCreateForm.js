import moment from 'moment';
import { parseUA, parseOS, parseDevice } from 'ua-parser';
import { putItem, getItem } from '../persistence';
import { generateFormToken } from '../utils';
import { FORMS_TABLE } from '../conventions';

function getRandomId () {
  return Math.round(Math.random() * 8999999999) + 1000000000
}

function getDeviceType (req) {
  let os = parseOS(req.headers['user-agent']).toString();
  if (os.indexOf('iOS') !== -1 || os.indexOf('Android') !== -1 || os.indexOf('Windows Phone') !== -1) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;
  const formData = req.body;

  bunyan.info('[CREATE-FORM] received', { email: formData.email });

  try {

    if (!formData.email) throw 'missing email field';

    let form = await getItem({ TableName: FORMS_TABLE, Key: { email: formData.email } }, dynamoClient);

    if (form) throw 'email already created a form';

    let params = {
      TableName: FORMS_TABLE,
      Item: {
        id: getRandomId(),
        ts: +moment().format('X'),
        email: formData.email,
        age: formData.age || null,
        gender: formData.gender || null,
        educationLevel: formData.educationLevel || null,
        requestInfo: {
          remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: parseUA(req.headers['user-agent']).toString(),
          os: parseOS(req.headers['user-agent']).toString(),
          device: parseDevice(req.headers['user-agent']).toString()
        },
        deviceType: getDeviceType(req),
        questions: [],
        comment: null,
        triedMoravec: null,
        answeredQuestionsAmount: 0,
        correctQuestionsAmount: 0,
        totalCompletionTime: null,
        isFinished: false
      },
      Key: {
        email: formData.email
      }
    };

    await putItem(params, dynamoClient);

    bunyan.info('[CREATE-FORM] success', { email: formData.email });

    res.send(200, { token: generateFormToken(config, formData.email) });

  } catch (error) {

    bunyan.error('[CREATE-FORM] error', error);

    res.send(500);

  }

}
