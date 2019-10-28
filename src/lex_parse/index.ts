import * as fs from 'fs'
import { exec } from 'child-process-promise'
import logger from '@getCodeforce/logger'
import { dataDirIterator, sleep } from '@getCodeforce/src/utils'

// https://github.com/cushionbadak/cppfileLex
const lexer = `${__dirname}/../../../Lexer/lx_cpp2csv`
// https://github.com/cushionbadak/cppfileParse
const parser = `${__dirname}/../../../cppfileParse/p_cpp2csv`

async function runLexerParser(retry=false) {
  const iterator = dataDirIterator()
  let dataNext = iterator.next()
  let files = []
  let fileLength = 20

  while (!dataNext.done) {
    const codedir = dataNext.value
    console.log(codedir)

    if (fs.existsSync(`${codedir}/code.cpp`)) {
      if (!retry) {
        continue
      }
    }    

    exec(`${lexer} ${codedir}/code.cpp ${codedir}/lexed.csv`) 
      .then(function (result) {
        logger.info(result.stdout)
        logger.error(result.stderr)
      })
      .catch(function (err) {
        logger.error(err)
      })
    sleep(200)

    // exec(`${parser} ${codedir}/code.cpp ${codedir}/parsed.csv`) 
    //   .then(function (result) {
    //     logger.info(result.stdout)
    //     logger.error(result.stderr)
    //   })
    //   .catch(function (err) {
    //     logger.error(err)
    //   })

    // files.push(codedir)
    // if (files.length >= fileLength) {
    //   try {
    //     const result = await Promise.all(files.map((filedir) => {
    //       return exec(`${lexer} ${filedir}/code.cpp ${filedir}/lexed.csv`) 
    //     }).concat(files.map((filedir) => {
    //       return exec(`${parser} ${filedir}/code.cpp ${filedir}/parsed.csv`) 
    //     })))
    //     logger.info(result)
    //   } catch (err) {
    //     logger.error(err)
    //     console.error(err)
    //   }

    //   files = []
    // }

    dataNext = iterator.next()
  }
}

async function execute() {
  await runLexerParser(true)
}

try {
  execute()
} catch (e) {
  logger.error(e)
  console.error(e)
}