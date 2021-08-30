import axios from "axios";
import { schedule } from 'node-cron'
import * as fs from 'fs'
import { GoogleSheet } from "./excel";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
require('dotenv').config()
const ExcelJS = require('exceljs');
// require('dotenv').config();

const writeFile = fs.writeFile

let CHK_INTERVAL = 10
let symbols = [
    'BTC/USD',
    'BTC-PERP'
]
 

let sheet6: GoogleSpreadsheetWorksheet | undefined
let spread_live!: object;

let doc_id: string = '1rH4D6yIB9NRNZDM5z_1keUECn62casZzURDdKpUfUuw'

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
    }).catch((err) => {
        console.log('Error: ', err );
        
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
                    url: `https://ftx.com/api/markets/${coins}`,
                    // params: {
                    //     symbol: `${coins}`,
                    // }
                })
                console.log(response.data);


            let idata = response.data.result

                const askPrice = idata.ask
                const bidPrice = idata.bid
                const timestamp = (await response).data.time_now

                console.log(`${bidPrice} :${askPrice} : ${timestamp}`);

                let sheetData = [
                    `${bidPrice}`,
                    `${askPrice}`,
                    `${new Date(timestamp * 1000).toUTCString()}`,
                ]

                console.log('price: ', coins == 'BTCUSD', coins)
                if (coins == 'BTC/USD') {
                    ask1 = askPrice
                    bid1 = bidPrice

                    gs.insertTo1(sheetData)
                    console.log('askPrice1', ask1)
                }
                if (coins == 'BTC-PERP') {
                    ask2 = askPrice
                    bid2 = bidPrice

                    console.log('bidPrice2', bid2)
                    gs.insertTo2(sheetData)
                }
                console.log('bidPrice2', bid2)
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
                console.log(error);
                

            }

        });



    })

}
    
    
market_data()