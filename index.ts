import axios from "axios";
import { schedule } from 'node-cron'
import * as fs from 'fs'
import { GoogleSheet } from "./excel";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

const ExcelJS = require('exceljs');
// require('dotenv').config();

const writeFile = fs.writeFile

let CHK_INTERVAL = 1
let symbols = [
    'BTC/USD',
    'BTC-PERP'
]
 

let sheet6: GoogleSpreadsheetWorksheet | undefined
let spread_live!: object;

let doc_id: string = '1JBKkv0oT8K2qIND9V5yyhBnqQzbzKZ2H8XxGOBnFcRA'

let doc = new GoogleSpreadsheet(doc_id)


let gs = new GoogleSheet()

let market_data = async () => {
    await gs.setup().then((res) => {
        console.log('Google sheet has been setup')
    }).catch((err) => {
        console.log('Error: ', err)
    })

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_GMAIL!,
        private_key: process.env.GOOGLE_KEY!
    })

    await doc.loadInfo();

    let ask1 = 0
    let ask2 = 0
    let bid1 = 0
    let bid2 = 0

    spread_live = {
        "Contract": "contract",
        "Long Spread": 'longSpread',
        "Short Spread": 'shortSpread'
    }

    sheet6 = doc.sheetsByIndex[5]

   

    await sheet6.loadCells()

    let b2 = sheet6?.getCellByA1('B2')
    let b3 = sheet6?.getCellByA1('B3')
    let c2 = sheet6?.getCellByA1('C2')
    let c3 = sheet6?.getCellByA1('C3')

    schedule(`*/${CHK_INTERVAL} * * * * *`, async () => {
        // console.log(askPrice ,':',bidPrice )
        symbols.forEach(async coins => {
            try {
                let response = await axios({
                    method: "GET",
                    url: `https://ftx.com/api/markets/${symbols}`,
                    params: {
                        symbol: `${coins}`,
                    }
                })
    // for (let i = 0; i < TOKENS.length; i++) {
    //     let candle = TOKENS[i]
    //     schedule(`*/${CHK_INTERVAL} * * * * *`, async () => {
    //        // console.log("running a task every 10 second")
    //         let response = await axios({
    //             method: 'GET',
    //             url: `https://ftx.com/api/markets/${candle}`,
    //             // headers: {
    //             //     'X-FTX-Key': process.env.API_KEY
    //             // }

    //         })
    //         // console.log(response.data);

            let idata = response.data.result

                const askPrice = idata[0].ask_price
                const bidPrice = idata[0].bid_price
                const timestamp = (await response).data.time_now

                // console.log(`${bidPrice} :${askPrice} : ${timestamp}`);

                let sheetData = [
                    `${bidPrice}`,
                    `${askPrice}`,
                    `${new Date(timestamp * 1000).toUTCString()}`,
                ]

                // console.log('pricee: ', coins == 'BTCUSD', coins)
                if (coins == 'BTCUSD') {
                    ask1 = askPrice
                    bid1 = bidPrice

                    gs.insertTo1(sheetData)
                    // console.log('askPrice', ask1)
                }
                if (coins == 'BTCUSDT') {
                    ask2 = askPrice
                    bid2 = bidPrice

                    // console.log('bidPrice2', bid2)
                    gs.insertTo2(sheetData)
                }
                // console.log('askPrice1', ask1)
                let shortSpread = (bid1 - ask2)
                let longSpread = (ask1 - bid2)


                let sPread = (bid2 - ask1)
                let lspread = (ask2 - bid1)

                let spreadData = [
                    `${longSpread}`,
                    `${shortSpread}`,
                    `${new Date(timestamp * 1000).toUTCString()}`,
                ]

                gs.insertTo3(spreadData)

                let spreadData2 = [
                    `${lspread}`,
                    `${sPread}`,
                    `${new Date(timestamp * 1000).toUTCString()}`,
                ]

                gs.insertTo4(spreadData2)



                // if(coins == 'BTCUSD'){}
                b2.value = longSpread
                b3.value = shortSpread
                c2.value = lspread
                c3.value = sPread

                await sheet6?.saveUpdatedCells()

                let liveSpread = [
                    `${coins}`,

                ]

            } catch (error) {
                throw new Error;

            }

        });



    })

}
    
    
market_data()