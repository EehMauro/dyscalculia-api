export default function (params, dynamoClient) {
  
  return new Promise ((resolve, reject) => {
  
    dynamoClient.delete(params, function(err, data) {

      if (err) {

        reject(err);

      } else {

        resolve(data);

      }

    });

  });

}