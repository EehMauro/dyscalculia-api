import bunyan from 'bunyan';

export default function (config) {

  return bunyan.createLogger({
    name: config.domain,
    level: config.level,
    stream: config.stream,
    serializers : bunyan.stdSerializers
  });

}
