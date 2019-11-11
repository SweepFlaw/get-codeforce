import { dynamodb, docClient } from './dynamodbSetting'
import { CodeforceDB, createTable, writeData, existData } from './codeforce.model'
import { createTestcaseTable, writeTestcase, existTestcase } from './testcase.model'


export {
  dynamodb,
  docClient,
  createTable,
  writeData,
  existData,
  CodeforceDB,
  createTestcaseTable,
  writeTestcase,
  existTestcase
}