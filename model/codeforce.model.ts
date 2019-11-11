import { dynamodb, docClient } from './dynamodbSetting'
import logger from '@getCodeforce/logger'

const tableName = 'codeforce'

export interface CodeforceDB { 
  user: string
  problem: string // contestId + '-' + problem index + '-' + submissionId
  submissionTime?: number
  code?: string
  verdict?: string
  programmingLanguage?: string
  passedTestCount?: number
  timeConsumedMillis?: number
  memoryConsumedBytes?: number
  relativeTimeSeconds?: number
}

export async function createTable() {
  const params = {
    TableName: tableName,
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
    logger.error(err)
  }
}

export async function writeData(datas: CodeforceDB[]) {
  for await (const data of datas) {
    const params = {
      TableName: tableName,
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
      logger.error(err)
    }
  }
}

export async function existData(data: CodeforceDB): Promise<boolean> {
  const params = {
    TableName: tableName,
    Key: {
      user: data.user,
      problem: data.problem
    }
  }

  try {
    const find = await docClient.get(params).promise()
    
    if (find.Item) {
      return true
    } else {
      return false
    }
  } catch (err) {
    logger.error(err)
  }
  return false
}