export default function (params, dynamoClient) {
  
  return new Promise ((resolve, reject) => {
  
    dynamoClient.describeTable(params, function(err, data) {

      if (err) {

        reject(err);

      } else {

        resolve(data);

      }

    });

  });

}