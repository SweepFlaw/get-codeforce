import * as fs from 'fs'
import { exec } from 'child-process-promise'
import logger from '@getCodeforce/logger'
import { dataDirIterator, parseCSV, saveCSV } from '@getCodeforce/src/utils'

const savepathdir = `${__dirname}/../../dataset/pretrain`
const tokenKind = {
  Punctuation: 0,
  Keyword: 1,
  Identifier: 2,
  Literal: 3,
  Comment: 4,
  "N/A": 5
}
const cursorKind = {
  VarDecl: 1,
  DeclRefExpr: 2,
  FunctionDecl: 3,
  IntegerLiteral: 4,
  CharacterLiteral: 5,
  ParmDecl: 6
}

interface VarPos {
  line: number | string
  column: number | string
  offset: number | string
}

interface VarState {
  [index: string]: VarPos
}


function embedding() {
  const iterator = dataDirIterator()
  let dataNext = iterator.next()
  
  while (!dataNext.done) {
    const pathdir = dataNext.value
    dataNext = iterator.next()

    if (pathdir.substr(pathdir.length-2, 2) === 'OK') {
      // embedding the lexed data
      // change only variables
      // capture VarDecl
      /*
        the origin line
        the origin column
        the origin offset
        now line
        now column
        now offset
        cursor kind
        token kind
      */
      if (fs.existsSync(`${pathdir}/lexed.csv`)) {
        const data = parseCSV(`${pathdir}/lexed.csv`, '\t')
        const varState: VarState = {}
        const embedded = []
        logger.info(`read file ${pathdir}/lexed.csv`)
        console.log(`read file ${pathdir}/lexed.csv`)
        
        for (const row of data) {
          if (row.length !== 6) {
            continue
          }
          if (cursorKind[row[3]] === 1
            || cursorKind[row[3]] === 3
            || cursorKind[row[3]] === 6) {
            varState[row[5]] = {
              line: row[0],
              column: row[1],
              offset: row[2]
            }
          }

          const embedToken = []
          
          /*
            the origin line
            the origin column
            the origin offset
         */
          if (varState[row[5]]) {
            embedToken.push(varState[row[5]].line)
            embedToken.push(varState[row[5]].column)
            embedToken.push(varState[row[5]].offset)
          } else {
            embedToken.push(row[0])
            embedToken.push(row[1])
            embedToken.push(row[2])
          }

          /*
            now line
            now column
            now offset
         */
          embedToken.push(row[0])
          embedToken.push(row[1])
          embedToken.push(row[2])

          /**
            cursor kind
            token kind
          */
          embedToken.push(cursorKind[row[3]] || -1)
          embedToken.push(tokenKind[row[4]] || -1)
        
          embedded.push(embedToken)
        }

        // save result
        if (embedded.length === 0) {
          continue
        }
        saveCSV(
          embedded,
          `${savepathdir}/${pathdir.split('/').join('-')}.csv`,
          '\t')
        logger.info(`save file as ${savepathdir}/${pathdir.split('/').join('-')}.csv`)
        console.log(`save file ${savepathdir}/${pathdir.split('/').join('-')}.csv`)
      }
    }
  }
}

try {
  embedding()
} catch (err) {
  logger.error(err)
  console.error(err)
}