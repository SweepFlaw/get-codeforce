import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'
import Status from './type'

let restc: rm.RestClient = new rm.RestClient('rest-samples', 'http://codeforces.com')
let httpc: hm.HttpClient = new hm.HttpClient('codeforce-http')

async function getContestList(): Promise<number[]> {
  let res: rm .IRestResponse<any> = await restc.get<any>('/api/contest.list?gym=false')
  
  if (res.statusCode.toString()[0] !== '2') {
    return []
  }
  
  return res.result.result.filter(data => data.phase === 'FINISHED').map(data => data.id)
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
  const sourceCode = parsed('#program-source-text')[0].children[0].data
  return sourceCode
}

async function getCodesFromContest() {
  const contestlist = await getContestList()
  console.log(`contest list count: ${contestlist.length}`)

  for await (const contestId of contestlist) {
    let from = 1;
    const count = 100;
    while (true) {
      const contestStatus = await getContestStatus(contestId, from, count)
      console.log(`read contest ${contestId} from ${from} to ${from + contestStatus.length - 1}`)
      from += count
      if (contestStatus.length <= 0) {
        break;
      }

      for await (const status of contestStatus) {
        const sourceCode = await getSourceCode(status.contestId, status.id)
        console.log(`contestId: ${status.contestId}`)
        console.log(`submissionId: ${status.id}`)
        console.log(`user handle: ${JSON.stringify(status.author.members, null, 2)}`)
        console.log(`source code:\n${sourceCode}`)
      }
      return
    }
  }
}

try {
  getCodesFromContest()
} catch (e) {
  console.log(e)
}