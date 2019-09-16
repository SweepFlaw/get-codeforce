import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'
import Status from './type'
import { writeData } from '../model'
import data from '../model/data';

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
    return 'fail'
  }
  
  let body: string = await res.readBody()
  
  const parsed = cheerio.load(body)
  if (parsed('#program-source-text').length === 0) {
    return 'fail'
  }
  const sourceCode = parsed('#program-source-text')[0].children[0].data
  return sourceCode
}

async function getCodesFromContest() {
  const contestlist = await getContestList()
  console.log(`contest list count: ${contestlist.length}`)

  for await (const contestId of contestlist) {
    let from = 1;
    const count = 100;

    let existSourceCode = true
    while (existSourceCode) {
      const contestStatus = await getContestStatus(contestId, from, count)
      console.log(`read contest ${contestId} from ${from} to ${from + contestStatus.length - 1}`)
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
          console.log(`no source code, http://codeforces.com/contest/${status.contestId}/submission/${status.id}`)
          existSourceCode = false
          break
        }

        console.log(`contestId: ${status.contestId}`)
        console.log(`submissionId: ${status.id}`)
        console.log(`user handle: ${status.author.members[0].handle}\n`)
        
        await writeData([{
          user: status.author.members[0].handle,
          problem: `${status.contestId}-${status.problem.index}-${status.id}`,
          submissionTime: status.creationTimeSeconds,
          code: sourceCode,
          verdict: status.verdict
        }])
      }
    }
  }
}

try {
  getCodesFromContest()
} catch (e) {
  console.log(e)
}