export default function (params, dynamoClient) {
  
  return new Promise ((resolve, reject) => {
  
    dynamoClient.get(params, function(err, data) {

      if (err) {

        reject(err);

      } else if (Object.keys(data).length === 0) {

        resolve(null);

      } else {

        resolve(data.Item);

      }

    });

  });

}