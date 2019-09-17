// http://codeforces.com/apiHelp/objects
interface Problem {
  contestId: number,
  problemsetName?: string,
  index: string,
  name: string,
  type: string,
  points: number,
  rating: number,
  tag: string[]
}

interface Member {
  handle: string // user handle
}

interface Party {
  contestId: number,
  members: Member[],
  participantType: string,
  teamId?: number,
  ghost: boolean,
  room?: number,
  startTimeSeconds?: number
}

export default interface Status {
  id: number,
  contestId?: number,
  creationTimeSeconds: number,
  relativeTimeSeconds: number,
  problem: Problem,
  author: Party,
  programmingLanguage: string,
  verdict: string,
  testset: string,
  passedTestCount: number,
  timeConsumedMillis: number,
  memoryConsumedBytes: number
}
