export default function (params, dynamoClient) {
  
  return new Promise ((resolve, reject) => {
  
    dynamoClient.scan(params, function(err, data) {

      if (err) {

        reject(err);

      } else if (Object.keys(data).length === 0) {

        resolve({ results: [], lastKey: null });

      } else {

        resolve({ results: data.Items, lastKey: data.LastEvaluatedKey });

      }

    });

  });
  
}