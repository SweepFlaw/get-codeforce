import * as fs from 'fs'
import { docClient, CodeforceDB } from '@getCodeforce/model'
import logger from '@getCodeforce/logger'

type Params = {
  TableName: string
  ExclusiveStartKey?: any
}

function saveToFile(data: CodeforceDB) {
  if (data.programmingLanguage.substr(0, 7) !== 'GNU C++') {
    return
  }

  const dataPath = `${__dirname}/../../datas`
  const { user } = data
  const [contestId, problemIndex, submissionId] = data.problem.split('-')

  const solved = ((verdict: string) => {
    if (verdict === 'OK') {
      return 'OK'
    } else if (verdict === 'WRONG_ANSWER') {
      return 'WA'
    }
    return 'ERR'
  })(data.verdict)

  if (fs.existsSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}${solved}`)) {
    logger.info(`already exists ${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}${solved}`)
    return
  }

  fs.mkdirSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}${solved}`, { recursive: true })
  fs.writeFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}${solved}/code.cpp`, data.code, { encoding: 'utf8' })
  fs.writeFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}${solved}/meta.json`,
    JSON.stringify({...data, code: ''}, null, 2),
    { encoding: 'utf8'})

  logger.info(`save files to ${dataPath}/${contestId}/${user}/${problemIndex}/${submissionId}`)
}

async function scanAndSave() {
  let ScannedCount = 1
  let LastEvaluatedKey = undefined
  let totalCount = 0

  while (ScannedCount > 0) {
    let params: Params = {
      TableName: 'codeforce'
    }
    
    if (LastEvaluatedKey) {
      params = { ExclusiveStartKey: LastEvaluatedKey, ...params }
    }

    let res: any
    try {
      res = await docClient.scan(params).promise()
    } catch (err) {
      logger.error(err)
    }
    ({ LastEvaluatedKey, ScannedCount } = res)

    res.Items.forEach((data: CodeforceDB) => {
      saveToFile(data)
    })
    totalCount += res.Items.length
    logger.info(`scan items total:  ${totalCount}`)

    if (!LastEvaluatedKey) {
      return
    }
  }
}

try {
  logger.info(`scan starts`)
  scanAndSave()
  logger.info(`scan end`)
} catch (err) {
  logger.error(JSON.stringify(err, null, 2))
}