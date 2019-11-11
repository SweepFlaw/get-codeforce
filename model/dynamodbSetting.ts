import * as AWS from 'aws-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AccessKeyId,
  secretAccessKey: process.env.SecretAccessKey
})

export const dynamodb = new AWS.DynamoDB({
  region: 'ap-northeast-2',
  // accessKeyId: process.env.AccessKeyId,
  // secretAccessKey: process.env.secretAccessKey,
  endpoint: 'http://dynamodb.ap-northeast-2.amazonaws.com'
})

export const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2',
  // accessKeyId: process.env.AccessKeyId,
  // secretAccessKey: process.env.secretAccessKey,
  endpoint: 'http://dynamodb.ap-northeast-2.amazonaws.com',
  convertEmptyValues: true
})
