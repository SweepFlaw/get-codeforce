import * as fs from 'fs'
import * as diff from 'diff'
import logger, { makeLogger } from '@getCodeforce/logger'

const dataPath = `${__dirname}/../../datas`
const contestIds = fs.readdirSync(dataPath)
const equalitySymbols = ['<', '<=', '>', '>=', '=', '==', '!=']
const operatorSymbols = ['-', '+', '*', '/', '%']

async function diffDatas() {
  // 한 단어가 다른 로그만 별도로 기록
  const aWordDiffLogger = makeLogger(`aWordDiff.log`)
  // 총 코드 개수
  let totalCodeCount = 0
  // 한 line이 다른 경우의 가짓 수
  let lineDiffCaseCount = 0
  // 한 개의 단어가 치환 or 생성 or 삭제된 경우의 가짓수
  let aWordDiffCaseCount = 0
  // 부등식/ 등식 잘못 씀
  let equalityDiffCaseCount = 0
  // 상수 잘못 씀
  let constantDiffCaseCount = 0
  // 변수 잘못 씀
  let variableDiffCaseCount = 0
  // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
  let vcDiffCaseCount = 0
  // operator 잘못 씀

  for await (const contestId of contestIds) {
    const users = fs.readdirSync(`${dataPath}/${contestId}`)

    for await (const user of users) {
      const problemIndexes = fs.readdirSync(`${dataPath}/${contestId}/${user}`)

      for await (const problemIndex of problemIndexes) {
        const submissionIds = fs.readdirSync(`${dataPath}/${contestId}/${user}/${problemIndex}`)
        totalCodeCount += submissionIds.length
        // console.log(`${contestId} ${user} ${problemIndex} has ${submissionIds.length} submisson`)
        
        if (submissionIds.length < 2) {
          // logger.info(`${contestId} ${user} ${problemIndex} has 1 submisson`)
          break
        }
  
        const okIndexes = submissionIds.map((submissionId, idx) => {
          if (submissionId.substr(submissionId.length - 2, 2) === 'OK') {
            return idx
          }
          return -1
        }).filter(num => num !== -1)
  
        if (okIndexes.length === 0) {
          // logger.info(`${contestId} ${user} ${problemIndex} did not solve problem`)
          break
        }
  
        let oki = 0
        let codeOK = fs.readFileSync(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`, { encoding: 'utf8'})
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
            
            lineDiffCaseCount += 1
            if (diffWord.length === 1 && diffWord[0].count === 1) {
              aWordDiffCaseCount += 1
            }
            if (diffWord.length === 2) {
              if (diffWord[0].added && diffWord[1].removed || diffWord[0].removed && diffWord[1].added) {
                if (diffWord[0].count === 1 && diffWord[1].count === 1) {
                  aWordDiffCaseCount += 1
                  aWordDiffLogger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[subi]}/code.cpp`)
                  aWordDiffLogger.info(`${dataPath}/${contestId}/${user}/${problemIndex}/${submissionIds[okIndexes[oki]]}/code.cpp`)
                  aWordDiffLogger.info(diffResult)
                  aWordDiffLogger.info(diffWord)
                  aWordDiffLogger.info(`Time diff: ${metaOK.submissionTime - metaWrong.submissionTime}`)
                  aWordDiffLogger.info(`other submission between them: ${okIndexes[oki] - subi - 1}`)

                  // 부등식/ 등식 잘못 씀
                  if (equalitySymbols.includes(diffWord[0].value) && equalitySymbols.includes(diffWord[1].value)) {
                    equalityDiffCaseCount += 1
                  } else if (!isNaN(Number((diffWord[0].value))) && !isNaN(Number((diffWord[1].value)))) {
                    // 상수 잘못 씀
                    constantDiffCaseCount += 1
                  } else if (diffWord[0].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g) && diffWord[1].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g)) {
                    // 변수 잘못 씀
                    variableDiffCaseCount += 1
                  } else if (diffWord[0].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g) && !isNaN(Number((diffWord[1].value)))
                    || !isNaN(Number((diffWord[0].value))) && diffWord[1].value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*/g)) {
                    // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
                    vcDiffCaseCount += 1
                  }  
                }
              }
            }
          }
        }
      }
    }
  }

  logger.info(`total code count: ${totalCodeCount}`)
  console.log(`total code count: ${totalCodeCount}`)
  logger.info(`a line diff case count : ${lineDiffCaseCount}`)
  console.log(`a line diff case count : ${lineDiffCaseCount}`)
  logger.info(`a word diff case count : ${aWordDiffCaseCount}`)
  console.log(`a word diff case count : ${aWordDiffCaseCount}`)


  // 부등식/ 등식 잘못 씀
  logger.info(`equality diff case count: ${equalityDiffCaseCount}`)
  // 상수 잘못 씀
  logger.info(`constant diff case count: ${constantDiffCaseCount}`)
  // 변수 잘못 씀
  logger.info(`variable diff case count: ${variableDiffCaseCount}`)
  // 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
  logger.info(`variable and constant diff case count: ${vcDiffCaseCount}`)
}

try {
  logger.info(`diff starts`)
  diffDatas()
} catch (err) {
  logger.error(err)
}