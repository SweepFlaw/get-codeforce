import { dynamodb, docClient } from './dynamodbSetting'
import logger from '@getCodeforce/logger'

const tableName = 'codeforce_testcase'

interface TestcaseDB {
  problem: string,
  number: number,
  input?: string,
  output?: string
}

export async function createTestcaseTable() {
  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: 'problem', // contestId-problemIndex
        KeyType: 'HASH'
      },
      {
        AttributeName: 'number',
        KeyType: 'RANGE'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'problem',
        AttributeType: 'S'
      },
      {
        AttributeName: 'number',
        AttributeType: 'N'
      }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
    }
  }

  try {
    await dynamodb.createTable(params).promise()
    logger.info('create testcase table')
  } catch (err) {
    logger.error(err)
  }
}

export async function writeTestcase(data: TestcaseDB) {
  const params = {
    TableName: tableName,
    Item: {
      problem: data.problem,
      number: data.number,
      input: data.input,
      output: data.output
    }
  }

  try {
    const added = await docClient.put(params).promise()
    logger.info('added testcase')
  } catch (err) {
    logger.error(err)
  }
}

export async function existTestcase(data: TestcaseDB): Promise<boolean> {
  const params = {
    TableName: tableName,
    Key: {
      problem: data.problem,
      number: data.number
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