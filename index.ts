import axios from "axios";
import cron, { schedule } from 'node-cron'
import * as fs from 'fs'
import { TOKENS } from './src/tokens'
import { ExcelSheet } from "./excell";

const ExcelJS = require('exceljs');
// require('dotenv').config();

const writeFile = fs.writeFile

let CHK_INTERVAL = 10
let PUSH_INTERVAL = 1

let excel = new ExcelSheet()


const market_data = async () => {
    await excel.setup().then((res) => {
        console.log('Excell set up');  
    }).catch((err) => console.log(err)
    )

    for (let i = 0; i < TOKENS.length; i++) {
        let candle = TOKENS[i]
        schedule(`*/${CHK_INTERVAL} * * * * *`, async () => {
           // console.log("running a task every 10 second")
            let response = await axios({
                method: 'GET',
                url: `https://ftx.com/api/markets/${candle}`,
                // headers: {
                //     'X-FTX-Key': process.env.API_KEY
                // }

            })
            // console.log(response.data);

            let bid = response.data.result.bid
            let ask = response.data.result.ask
            console.log('Bid Price: ',bid);
            console.log('Ask Price: ',ask);

            if(response.data.result.name == "BTC/USD") {
            
                
            excel.add_row_usd([
                `${bid}`,
                `${ask}`,
            ]).then(() => console.log('Row saved')
            )}

            if(response.data.result.name == "BTC-PERP") {
            
                
                excel.add_row_perp([
                    `${bid}`,
                    `${ask}`,
                ]).then(() => console.log('Row saved')
                )}
            // let data = response.data
            // var options = {
            //     headers: ''
            // }
            // let excelData = await ExcelJS.exceljs(data, options)
            // writeFile(`./excel_data/data.xlsx`, excelData, (err: any) => {
            //     if (err) {
            //         // Handle the errors
            //         console.log(err);
            //         throw new Error(err);
            //     }
            //     console.log(` Datasaved into excel files successfully😊`);
            // })

        })
        
    }
}
    
    
market_data()