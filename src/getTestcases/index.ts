import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'
import Status from '@getCodeforce/src/crawl/type'
import { writeTestcase, existTestcase } from '@getCodeforce/model'
import logger from '@getCodeforce/logger'
import { sleep } from '@getCodeforce/src/utils'
import { write } from 'fs'

let restc: rm.RestClient = new rm.RestClient('rest-samples', 'http://codeforces.com')
let httpc: hm.HttpClient = new hm.HttpClient('codeforce-http')
const additionalHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
}

async function getContestList(): Promise<number[]> {
  let res: rm.IRestResponse<any>

  try {
    res = await restc.get<any>('/api/contest.list?gym=false', {
      additionalHeaders
    })
  
    if (res.statusCode.toString()[0] !== '2') {
      return []
    }
  } catch (err) {
    logger.error(err)
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
  
    if (res.statusCode.toString()[0] !== '2') {
      return []
    }
  } catch (err) {
    logger.error(err)
  }
  
  return res.result.result
}

async function getTestcase(contestId, submissionId): Promise<string> {
  // let res: rm.IRestResponse<any>
  let res: hm.HttpClientResponse
  
  try {
    // res = await restc.create<any>(`http://codeforces.com/data/submitSource`,
    //   { submissionId },
    //   {
    //     additionalHeaders: {
    //       referer: `http://codeforces.com/contest/${contestId}/submission/${submissionId}`,
    //       ...additionalHeaders
    //     }
    //   }
    // )
    
    res = await httpc.get(`http://codeforces.com/contest/${contestId}/submission/${submissionId}`, {
      additionalHeaders
    })

    if (res.message.statusCode.toString()[0] === '2') {
      console.log(`get submit source`)
      // console.log(res)
      res = await httpc.post(`http://codeforces.com/data/submitSource`,
        // `submissionId=${submissionId}`,
        `{ submissionId: ${submissionId}}`,
        {
          additionalHeaders: {
            origin: `https://codeforces.com`,
            referer: `http://codeforces.com/contest/${contestId}/submission/${submissionId}`,
            ...additionalHeaders
          }
        }
      )
    } else {
      // console.error(res)
      logger.error(res)
      return 'fail'
    }
    

    if (res.message.statusCode.toString()[0] !== '2') {
      // console.error(res)
      logger.error(res)
      console.error(await res.readBody())
      return 'wrong status code'
    }
  } catch (err) {
    logger.error(err)
    console.error(err)
  }
  
  console.log(res)

  return ''
}

async function getCodesFromContest() {
  const contestlist = await getContestList()
  logger.info(`contest list count: ${contestlist.length}`)
  // const notSearching = [1209, 1214, 1215, 1220, 1229, 1230]

  for await (const contestId of contestlist) {
    // if (notSearching.includes(contestId)) {
    //   continue
    // }
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
        if (await existTestcase({
          problem: `${status.contestId}-${status.problem.index}`,
          number: 0
        })) {
          continue
        }

        const sourceCode = await getTestcase(status.contestId, status.id)
        return

        if (sourceCode === 'fail') {
          logger.error(`no source code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)
          
          await sleep(120000)
          continue
        }

        logger.info(`contestId: ${status.contestId}`)
        logger.info(`submissionId: ${status.id}`)
        
        await writeTestcase({
          problem: `${status.contestId}-${status.problem.index}`,
          number: 0
        })

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