import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'
import Status from './type'
import { writeData } from '@getCodeforce/model'
import logger from '@getCodeforce/logger'
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

let restc: rm.RestClient = new rm.RestClient('rest-samples', 'http://codeforces.com')
let httpc: hm.HttpClient = new hm.HttpClient('codeforce-http')

async function getContestList(): Promise<number[]> {
  let res: rm .IRestResponse<any> = await restc.get<any>('/api/contest.list?gym=false')
  
  if (res.statusCode.toString()[0] !== '2') {
    return []
  }
  
  return res.result.result
    .filter(data => data.phase === 'FINISHED' && data.type === 'CF')
    .map(data => data.id)
}

async function getContestStatus(contestId, from, count): Promise<Status[]> {
  let res: rm .IRestResponse<any> = await restc.get<any>(`/api/contest.status?contestId=${contestId}&from=${from}&count=${count}`)
  
  if (res.statusCode.toString()[0] !== '2') {
    return []
  }
  
  return res.result.result
}

async function getSourceCode(contestId, submissionId): Promise<string> {
  let res: hm.HttpClientResponse = await httpc.get(`http://codeforces.com/contest/${contestId}/submission/${submissionId}`)
  if (res.message.statusCode.toString()[0] !== '2') {
    return 'wrong status code'
  }
  
  let body: string = await res.readBody()
  
  const parsed = cheerio.load(body)
  if (parsed('#program-source-text').length === 0) {
    return 'fail'
  }
  const sourceCode = parsed('#program-source-text')[0].children[0].data
  return sourceCode
}

const sleep = (ms) => {
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

async function getCodesFromContest() {
  const contestlist = await getContestList()
  logger.info(`contest list count: ${contestlist.length}`)

  for await (const contestId of contestlist) {
    let from = 1;
    const count = 100;

    let existSourceCode = true
    while (existSourceCode) {
      const contestStatus = await getContestStatus(contestId, from, count)
      logger.info(`read contest ${contestId} from ${from} to ${from + contestStatus.length - 1}`)
      from += count
      if (contestStatus.length <= 0) {
        break;
      }

      for await (const status of contestStatus) {
        if (status.author.members.length !== 1) {
          continue;
        }

        const sourceCode = await getSourceCode(status.contestId, status.id)
        if (sourceCode === 'fail') {
          logger.error(`no source code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)
          existSourceCode = false
          break
        } else if (sourceCode === 'wrong status code') {
          logger.error(`wrong status code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)
          
          await sleep(1000)
          continue;
        }

        logger.info(`contestId: ${status.contestId}`)
        logger.info(`submissionId: ${status.id}`)
        
        await writeData([{
          user: status.author.members[0].handle,
          problem: `${status.contestId}-${status.problem.index}-${status.id}`,
          submissionTime: status.creationTimeSeconds,
          code: sourceCode,
          verdict: status.verdict,
          programmingLanguage: status.programmingLanguage,
          passedTestCount: status.passedTestCount,
          timeConsumedMillis: status.timeConsumedMillis,
          memoryConsumedBytes: status.memoryConsumedBytes,
          relativeTimeSeconds: status.relativeTimeSeconds
        }])
        await sleep(50)
      }
    }
  }
}

try {
  getCodesFromContest()
} catch (err) {
  logger.error(JSON.stringify(err, null, 2))
}