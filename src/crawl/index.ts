import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'
import Status from './type'
import { writeData, existData } from '@getCodeforce/model'
import logger from '@getCodeforce/logger'

let restc: rm.RestClient = new rm.RestClient('rest-samples', 'http://codeforces.com')
let httpc: hm.HttpClient = new hm.HttpClient('codeforce-http')
const additionalHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
}

async function getContestList(): Promise<number[]> {
  let res: rm .IRestResponse<any>

  try {
    res = await restc.get<any>('/api/contest.list?gym=false', {
      additionalHeaders
    })
  } catch (err) {
    logger.error(err)
  }
  
  if (res.statusCode.toString()[0] !== '2') {
    return []
  }
  
  return res.result.result
    .filter(data => data.phase === 'FINISHED' && data.type === 'CF')
    .map(data => data.id)
}

async function getContestStatus(contestId, from, count): Promise<Status[]> {
  let res: rm .IRestResponse<any>

  try {
    res = await restc.get<any>(`/api/contest.status?contestId=${contestId}&from=${from}&count=${count}`, {
      additionalHeaders
    })
  } catch (err) {
    logger.error(err)
  }
  
  if (res.statusCode.toString()[0] !== '2') {
    return []
  }
  
  return res.result.result
}

async function getSourceCode(contestId, submissionId): Promise<string> {
  let res: hm.HttpClientResponse
  
  try {
    res = await httpc.get(`http://codeforces.com/contest/${contestId}/submission/${submissionId}`, {
      additionalHeaders
    })
  } catch (err) {
    logger.error(err)
  }

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
  const notSearching = [1209, 1214, 1215, 1220, 1229, 1230]

  for await (const contestId of contestlist) {
    if (notSearching.includes(contestId)) {
      continue
    }
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
          continue
        }

        // 이미 검색했으면 다음 검색
        if (await existData({
          user: status.author.members[0].handle,
          problem: `${status.contestId}-${status.problem.index}-${status.id}`
        })) {
          continue
        }

        const sourceCode = await getSourceCode(status.contestId, status.id)

        if (sourceCode === 'fail') {
          logger.error(`no source code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)
          
          // wait 5 minute, maybe server block crawler
          await sleep(300000)
          continue
        } else if (sourceCode === 'wrong status code') {
          logger.error(`wrong status code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)

          // wait 5 minute, maybe server block crawler
          await sleep(300000)
          continue
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

        // wait at least 1s
        await sleep(300)
      }
    }
  }
}

try {
  getCodesFromContest()
} catch (err) {
  logger.error(err)
}