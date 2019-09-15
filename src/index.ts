import * as rm from 'typed-rest-client/RestClient'
import * as hm from 'typed-rest-client/HttpClient'
import * as cheerio from 'cheerio'

let restc: rm.RestClient = new rm.RestClient('rest-samples', 'http://codeforces.com')
let httpc: hm.HttpClient = new hm.HttpClient('codeforce-http')

async function runContestList() {
  let res: rm .IRestResponse<any> = await restc.get<any>('/api/contest.list?gym=true')
  console.log(res.statusCode)
  console.log(res.result)
}

async function runContestStatus() {
  let res: rm .IRestResponse<any> = await restc.get<any>('/api/contest.status?contestId=1209&from=1&count=10')
  console.log(res.statusCode)
  console.log(JSON.stringify(res.result, null, 2))
}

async function getSourceCode() {
  let res: hm.HttpClientResponse = await httpc.get('http://codeforces.com/contest/1209/submission/60532598')
  console.log(res.message.statusCode)
  let body: string = await res.readBody()
  
  const parsed = cheerio.load(body)
  const sourceCode = parsed('#program-source-text')[0].children[0].data
  console.log(sourceCode)
}

getSourceCode()