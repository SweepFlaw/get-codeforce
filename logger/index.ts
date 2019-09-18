import * as winston from 'winston'

export default winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${__dirname}/../logs/error.${(new Date()).toISOString()}.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `${__dirname}/../logs/info.${(new Date()).toISOString()}.log`,
      level: 'info'
    })
  ],
  exitOnError: false
})