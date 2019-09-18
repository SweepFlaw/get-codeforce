import * as AWS from 'aws-sdk'
import * as dotenv from 'dotenv'
import logger from '@getCodeforce/logger'
import datas from './data'
dotenv.config()

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AccessKeyId,
  secretAccessKey: process.env.SecretAccessKey
})

const dynamodb = new AWS.DynamoDB({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AccessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: 'http://dynamodb.ap-northeast-2.amazonaws.com'
})

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AccessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: 'http://dynamodb.ap-northeast-2.amazonaws.com',
  convertEmptyValues: true
})

async function createTable() {
  const params = {
    TableName: 'codeforce',
    KeySchema: [
      {
        AttributeName: 'user',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'problem',
        KeyType: 'RANGE'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'user',
        AttributeType: 'S'
      },
      {
        AttributeName: 'problem',
        AttributeType: 'S'
      }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
    }
  }

  try {
    await dynamodb.createTable(params).promise()
    logger.info('table created')
  } catch (err) {
    logger.error(JSON.stringify(err, null, 2))
  }
}

async function writeData(datas: CodeforceDB[]) {
  for await (const data of datas) {
    const params = {
      TableName: 'codeforce',
      Item: {
        user: data.user,
        problem: data.problem,
        submissionTime: data.submissionTime,
        code: data.code,
        verdict: data.verdict,
        programmingLanguage: data.programmingLanguage,
        passedTestCount: data.passedTestCount,
        timeConsumedMillis: data.timeConsumedMillis,
        memoryConsumedBytes: data.memoryConsumedBytes,
        relativeTimeSeconds: data.relativeTimeSeconds
      }
    }

    try {
      const added = await docClient.put(params).promise()
      logger.info('added data')
    } catch (err) {
      logger.error(JSON.stringify(err, null, 2))
    }
  }
}

async function findData(datas: CodeforceDB[]) {
  for await (const data of datas) {
    const params = {
      TableName: 'codeforce',
      Key: {
        user: data.user,
        problem: data.problem
      }
    }

    try {
      const find = await docClient.get(params).promise()
      logger.info('find data')
    } catch (err) {
      logger.error(JSON.stringify(err, null, 2))
    }
  }
}

interface CodeforceDB { 
  user: string,
  problem: string, // contestId + '-' + problem index + '-' + submissionId
  submissionTime: number,
  code: string,
  verdict: string
  programmingLanguage: string,
  passedTestCount: number,
  timeConsumedMillis: number,
  memoryConsumedBytes: number,
  relativeTimeSeconds: number
}

export {
  dynamodb,
  docClient,
  createTable,
  writeData,
  findData,
  CodeforceDB
}