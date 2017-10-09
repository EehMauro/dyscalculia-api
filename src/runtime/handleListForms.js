import { scanItems } from '../persistence';
import { FORMS_TABLE } from '../conventions';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;

  let { fromDate, toDate, fromAge, toAge, gender, educationLevel, limit, lastKey } = req.params;

  bunyan.info('[LIST-FORMS] received');

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

    if (fromAge) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#age >= :fromAge';
      ExpressionAttributeNames['#age'] = 'age';
      ExpressionAttributeValues[':fromAge'] = fromAge;
    }

    if (toAge) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#age <= :toAge';
      ExpressionAttributeNames['#age'] = 'age';
      ExpressionAttributeValues[':toAge'] = toAge;
    }

    if (gender) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#gender = :gender';
      ExpressionAttributeNames['#gender'] = 'gender';
      ExpressionAttributeValues[':gender'] = gender;
    }

    if (educationLevel) {
      FilterExpression += (FilterExpression === '' ? '' : ' AND ') + '#educationLevel = :educationLevel';
      ExpressionAttributeNames['#educationLevel'] = 'educationLevel';
      ExpressionAttributeValues[':educationLevel'] = educationLevel;
    }

    let results = [];
    let reachedLimit = false;
    let currentLimit = parseInt(limit);

    while (!reachedLimit) {

      currentLimit *= 2;

      let params = {
        TableName: FORMS_TABLE,
        FilterExpression: FilterExpression !== '' ? FilterExpression : undefined,
        ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length ? ExpressionAttributeNames : undefined,
        ExpressionAttributeValues: Object.keys(ExpressionAttributeValues).length ? ExpressionAttributeValues : undefined,
        ExclusiveStartKey: lastKey ? { id: lastKey } : undefined,
        Limit: currentLimit || undefined
      };

      let response = await scanItems(params, dynamoClient);

      results.push(...response.results);

      if (!response.lastKey || limit && results.length >= limit) {

        reachedLimit = true;

      } else {

        lastKey = response.lastKey.id;

      }
    
    }

    if (limit && results.length >= limit) {

      results.length = limit;
      
      lastKey = results[results.length-1].id;

    }

    bunyan.info('[LIST-FORMS] success', { results: results.length });

    res.send(200, { results, lastKey });

  } catch (error) {

    bunyan.error('[LIST-FORMS] error', error);

    res.send(500);

  }

}
