import * as fs from 'fs'
import * as diff from 'diff'
import logger, { makeLogger } from '@getCodeforce/logger'

const dataPath = `${__dirname}/../../datas`
const contestIds = fs.readdirSync(dataPath)
const equalitySymbols = ['<', '<=', '>', '>=', '=', '==', '!=']
const operatorSymbols = ['-', '+', '*', '/', '%',
  '^', '&', '|', '&&', '||', '++', '--', '~', '!', '<<', '>>',
  '+=', '-=', '/=', '*=', '%=', '&=', '|=', '^=', '<<=', '>>='
]

async function diffDatas() {
  // 한 단어가 다른 로그만 별도로 기록
  const aWordDiffLogger = makeLogger(`aWordDiff.log`)
  // 총 코드 개수
  let totalCodeCount = 0
  // 문제를 푼 케이스의 개수
  let solvedCaseCount = 0
  // 문제를 못 푼 케이스
  let cannotSolveCaseCount = 0
  // 한번에 푼 케이스
  let oneTimeSolvedCaseCount = 0
  // 한 줄만 달라서 틀린 문제 수
  let wrongLineProblemCaseCount = 0
  // 한 단어만 달라서 틀린 문제 수
  let wrongWordProblemCaseCount = 0
  // 한 line이 다른 경우의 쌍의 가짓 수, 한 문제에서 여러 번 가능
  let lineDiffCaseCount = 0
  // 한 개의 단어가 치환 or 생성 or 삭제된 경우의 가짓수, 한 문제에서 여러 번 가능
  let aWordDiffCaseCount = 0
  let aWordDiffTime = 0
  // 부등식/ 등식 잘못 씀
  let equalityDiffCaseCount = 0
  let equalityDiffTime = 0
  // 상수 잘못 씀
  let constantDiffCaseCount = 0
  let constantDiffTime = 0
  // 변수 잘못 씀
  let variableDiffCaseCount = 0
  let variableDiffTime = 0
  // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
  let vcDiffCaseCount = 0
  let vcDiffTime = 0
  // operator 잘못 씀
  let operDiffCaseCount = 0
  let operDiffTime = 0

  // only add in a line
  let onlyAddCaseCount = 0
  let onlyAddTime = 0
  // only remove in a line
  let onlyRemoveCaseCount = 0
  let onlyRemoveTime = 0

  for (const contestId of contestIds) {
    const users = fs.readdirSync(`${dataPath}/${contestId}`)

    for (const user of users) {
      const problemIndexes = fs.readdirSync(`${dataPath}/${contestId}/${user}`)

      for (const problemIndex of problemIndexes) {
        const submissionIds = fs.readdirSync(`${dataPath}/${contestId}/${user}/${problemIndex}`)
        totalCodeCount += submissionIds.length
        // console.log(`${contestId} ${user} ${problemIndex} has ${submissionIds.length} submisson`)

        const okIndexes = submissionIds.map((submissionId, idx) => {
          if (submissionId.substr(submissionId.length - 2, 2) === 'OK') {
            return idx
          }
          return -1
        }).filter(num => num !== -1)
  
        if (okIndexes.length === 0) {
          // logger.info(`${contestId} ${user} ${problemIndex} did not solve problem`)
          cannotSolveCaseCount += 1
          continue
        }
        // 문제를 푼 케이스의 개수
        solvedCaseCount += 1
        
        if (submissionIds.length < 2) {
          // logger.info(`${contestId} ${user} ${problemIndex} has 1 submisson`)
          oneTimeSolvedCaseCount += 1
          continue
        }
  
        let oki: number = 0
        let codeOK: string = fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`, { encoding: 'utf8'})
        let isLineDiff: boolean = false
        let isWordDiff: boolean = false
        for (let subi = 0; subi < submissionIds.length; subi += 1) {
          if (subi === okIndexes[oki]) {
            oki += 1
            if (oki >= okIndexes.length) {
              break
            }
            codeOK = fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`, { encoding: 'utf8'})
            continue
          }
  
          // only wrong answer
          if (submissionIds[subi].substr(submissionIds[subi].length - 2, 2) !== 'WA') {
            continue
          }
  
          const codeWrong = fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[subi]}/code.cpp`, { encoding: 'utf8'})
          
          let lines: number = 1
          let diffLineAdder: boolean = false
          const diffResult = diff
            .diffLines(codeWrong, codeOK)
            .map((res) => {
              const result = { line: lines, ...res }
              if (!diffLineAdder) {
                lines += (res.value.match(/\n/g) || []).length
              }
              diffLineAdder = !diffLineAdder
              return result
            })
            .filter(res => res.added === true || res.removed === true)

          if (diffResult.length === 2
            && diffResult[0].count === 1
            && diffResult[0].line === diffResult[1].line) {
            if (diffResult[0].added === true) {
              const temp = diffResult[0]
              diffResult[0] = diffResult[1]
              diffResult[1] = temp
            }

            // read meta.json
            const metaWrong = JSON.parse(fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[subi]}/meta.json`, { encoding: 'utf8' }))
            const metaOK = JSON.parse(fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/meta.json`, { encoding: 'utf8' }))
            const diffWord = diff
              .diffWords(diffResult[0].value, diffResult[1].value)
              .filter(res => res.added === true || res.removed === true)

            console.log(`${contestId} ${user} ${problemIndex} diff result with ${submissionIds[okIndexes[oki]]} and ${submissionIds[subi]}`)
            logger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[subi]}/code.cpp`)
            logger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`)
            logger.info(diffResult)
            logger.info(diffWord)
            logger.info(`Time diff: ${metaOK.submissionTime - metaWrong.submissionTime}`)
            logger.info(`other submission between them: ${okIndexes[oki] - subi - 1}`)

            isLineDiff = true // 이 문제는 한 줄만 달라서 틀린 적이 있다
            lineDiffCaseCount += 1

            if (diffWord.length === 1 && diffWord[0].count === 1) {
              aWordDiffCaseCount += 1
            }
            if (diffWord.length === 2) {
              if (diffWord[0].added && diffWord[1].removed || diffWord[0].removed && diffWord[1].added) {
                if (diffWord[0].count === 1 && diffWord[1].count === 1) {
                  let timeDiff = metaOK.submissionTime - metaWrong.submissionTime
                  isWordDiff = true // 이 문제는 한 단어만 달라서 틀린 적이 있다.
                  aWordDiffCaseCount += 1
                  aWordDiffTime += timeDiff <= 7200 ? timeDiff : 7200

                  aWordDiffLogger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[subi]}/code.cpp`)
                  aWordDiffLogger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`)
                  aWordDiffLogger.info(diffResult)
                  aWordDiffLogger.info(diffWord)
                  aWordDiffLogger.info(`Time diff: ${timeDiff}`)
                  aWordDiffLogger.info(`other submission between them: ${okIndexes[oki] - subi - 1}`)

                  // 부등식/ 등식 잘못 씀
                  if (equalitySymbols.includes(diffWord[0].value) && equalitySymbols.includes(diffWord[1].value)) {
                    equalityDiffCaseCount += 1
                    equalityDiffTime += timeDiff <= 7200 ? timeDiff : 7200
                  } else if (!isNaN(Number((diffWord[0].value))) && !isNaN(Number((diffWord[1].value)))) {
                    // 상수 잘못 씀
                    constantDiffCaseCount += 1
                    constantDiffTime += timeDiff <= 7200 ? timeDiff : 7200
                  } else if (diffWord[0].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g) && diffWord[1].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g)) {
                    // 변수 잘못 씀
                    variableDiffCaseCount += 1
                    variableDiffTime += timeDiff <= 7200 ? timeDiff : 7200
                  } else if (diffWord[0].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g) && !isNaN(Number((diffWord[1].value)))
                    || !isNaN(Number((diffWord[0].value))) && diffWord[1].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g)) {
                    // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
                    vcDiffCaseCount += 1
                    vcDiffTime += timeDiff <= 7200 ? timeDiff : 7200
                    // console.log(diffWord)
                  } else if (operatorSymbols.includes(diffWord[0].value) && operatorSymbols.includes(diffWord[0].value)) {
                    operDiffCaseCount += 1
                    operDiffTime += timeDiff <= 7200 ? timeDiff : 7200
                  }
                }
              }
            }

            // only add or remove
            let timeDiff = metaOK.submissionTime - metaWrong.submissionTime
            if (diffWord.reduce((res, val) => res && val.added, true)) {
              onlyAddCaseCount += 1
              onlyAddTime += timeDiff <= 7200 ? timeDiff : 7200
            }
            if (diffWord.reduce((res, val) => res && val.removed, true)) {
              onlyRemoveCaseCount += 1
              onlyRemoveTime += timeDiff <= 7200 ? timeDiff : 7200
            }
          }
        }

        if (isLineDiff) {
          wrongLineProblemCaseCount += 1
        }
        if (isWordDiff) {
          wrongWordProblemCaseCount += 1
        }
      }
    }
  }

  logger.info(`total code count: ${totalCodeCount}`)
  console.log(`total code count: ${totalCodeCount}`)
  logger.info(`solved case count: ${solvedCaseCount}`)
  console.log(`solved case count: ${solvedCaseCount}`)
  logger.info(`cannot solve case count: ${cannotSolveCaseCount}`)
  console.log(`cannot solve case count: ${cannotSolveCaseCount}`)
  logger.info(`solve at once case count: ${oneTimeSolvedCaseCount}`)
  console.log(`solve at once case count: ${oneTimeSolvedCaseCount}`)
  logger.info(`a line diff problem case count : ${wrongLineProblemCaseCount}`)
  console.log(`a line diff problem case count : ${wrongLineProblemCaseCount}`)
  logger.info(`a word diff problem case count : ${wrongWordProblemCaseCount}`)
  console.log(`a word diff problem case count : ${wrongWordProblemCaseCount}`)
  logger.info(`a line diff case count, can exist multiple pairs in one problem : ${lineDiffCaseCount}`)
  console.log(`a line diff case count, can exist multiple pairs in one problem : ${lineDiffCaseCount}`)
  logger.info(`a word diff case count, can exist multiple pairs in one problem : ${aWordDiffCaseCount}`)
  console.log(`a word diff case count, can exist multiple pairs in one problem : ${aWordDiffCaseCount}`)
  logger.info(`a word diff average seconds, can exist multiple pairs in one problem : ${aWordDiffTime / aWordDiffCaseCount}`)
  console.log(`a word diff average seconds, can exist multiple pairs in one problem : ${aWordDiffTime / aWordDiffCaseCount}`)


  // 부등식/ 등식 잘못 씀
  logger.info(`equality diff case count: ${equalityDiffCaseCount}`)
  logger.info(`equality diff average seconds: ${equalityDiffTime / equalityDiffCaseCount}`)
  // 상수 잘못 씀
  logger.info(`constant diff case count: ${constantDiffCaseCount}`)
  logger.info(`constant diff average seconds: ${constantDiffTime / constantDiffCaseCount}`)
  // 변수 잘못 씀
  logger.info(`variable diff case count: ${variableDiffCaseCount}`)
  logger.info(`variable diff average seconds: ${variableDiffTime / variableDiffCaseCount}`)
  // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
  logger.info(`variable and constant diff case count: ${vcDiffCaseCount}`)
  logger.info(`variable and constant diff average seconds: ${vcDiffTime / vcDiffCaseCount}`)
  // operator 잘못 씀 except (in)equality
  logger.info(`operator diff case count: ${operDiffCaseCount}`)
  logger.info(`operator diff average seconds: ${operDiffTime / operDiffCaseCount}`)

  // only add in a line
  logger.info(`only add in a line case count: ${onlyAddCaseCount}`)
  logger.info(`only add in a line average seconds: ${onlyAddTime / onlyAddCaseCount}`)
  // only remove in a line
  logger.info(`only remove in a line case count: ${onlyRemoveCaseCount}`)
  logger.info(`only remove in a line average seconds: ${onlyRemoveTime / onlyRemoveCaseCount}`)
}

try {
  logger.info(`diff starts`)
  diffDatas()
} catch (err) {
  logger.error(err)
}