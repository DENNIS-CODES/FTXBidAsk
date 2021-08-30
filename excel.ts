import { GoogleSpreadsheet, GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
require('dotenv').config()
if (!process.env.GOOGLE_KEY && !process.env.GOOGLE_GMAIL) {
    `GOOGLE_KEY && GOOGLE_GMAIL must be defined in your .env file`
}

// console.log(process.env.GOOGLE_GMAIL)
// console.log(process.env.GOOGLE_KEY!.replace(/\\n/gm, '\n'))

export class GoogleSheet {
    readonly doc: any
    sheet1: GoogleSpreadsheetWorksheet | undefined
    sheet2: GoogleSpreadsheetWorksheet | undefined
    sheet3: GoogleSpreadsheetWorksheet | undefined
    sheet4: GoogleSpreadsheetWorksheet | undefined
    sheet5: GoogleSpreadsheetWorksheet | undefined

    b2: GoogleSpreadsheetCell | undefined
    b3: GoogleSpreadsheetCell | undefined
    c2: GoogleSpreadsheetCell | undefined
    c3: GoogleSpreadsheetCell | undefined
    readonly header_to_key!: object;
    readonly spread_header_to_key!: object;
    readonly spread_live!: object;

    constructor(
        doc_id: string = '1rH4D6yIB9NRNZDM5z_1keUECn62casZzURDdKpUfUuw'
    ) {
        this.doc = new GoogleSpreadsheet(doc_id)

        // console.log(this.doc)

        this.header_to_key = {
            "Bid Price": 'bid_price',
            "Ask Price": 'ask_price',
            "Time": 'timestamp',
        }

        this.spread_header_to_key = {
            "Long Spread": 'longSpread',
            "Short Spread": 'shortSpread',
            "Time": 'timestamp',
        }

        this.spread_live = {
            "Long Spread": 'longSpread',
            "Short Spread": 'shortSpread'
        }
    }

    setup = async () => {
        await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_GMAIL!,
            private_key: process.env.GOOGLE_KEY!
        })

        await this.doc.loadInfo();

        this.sheet1 = this.doc.sheetsByIndex[0];
        this.sheet2 = this.doc.sheetsByIndex[1]
        this.sheet3 = this.doc.sheetsByIndex[2]
        this.sheet4 = this.doc.sheetsByIndex[3]
        this.sheet5 = this.doc.sheetsByIndex[5]

    


        // console.log("Sheet ", this.sheet1)

        // await this.sheet1?.clear()
        // await this.sheet2?.clear()
        // await this.sheet3?.clear()
        // await this.sheet4?.clear()
        // await this.sheet6?.clear()


        this.sheet1?.setHeaderRow(Object.keys(this.header_to_key))
        this.sheet2?.setHeaderRow(Object.keys(this.header_to_key))

        this.sheet3?.setHeaderRow(Object.keys(this.spread_header_to_key))
        this.sheet4?.setHeaderRow(Object.keys(this.spread_header_to_key))
        this.sheet5?.setHeaderRow(Object.keys(this.spread_live))
    }

    insertTo1 = async (record: any[]) => {
        try {
            // console.log("inserting rows")
            // console.log(record)
            await this.sheet1?.addRow(record, { raw: true, insert: true })
        } catch (error) {
            console.log("Error adding data to sheet ", error)
        }
    }

    insertTo2 = async (record: any[]) => {
        try {
            // console.log("inserting rows")
            // console.log(record)
            await this.sheet2?.addRow(record, { raw: true, insert: true })
        } catch (error) {
            console.log("Error adding data to sheet ", error)
        }
    }

    insertTo3 = async (record: any[]) => {
        try {
            // console.log("inserting rows")
            // console.log(record)
            await this.sheet3?.addRow(record, { raw: true, insert: false })
        } catch (error) {
            console.log("Error adding data to sheet ", error)
        }
    }

    insertTo4 = async (record: any[]) => {
        try {
            // console.log("inserting rows")
            // console.log(record)
            await this.sheet4?.addRow(record, { raw: true, insert: false })
        } catch (error) {
            console.log("Error adding data to sheet ", error)
        }
    }

    insertTo6 = async (record: any[]) => {
        try {
            await this.sheet5?.addRow(record, { raw: true, insert: false })
        } catch (error) {
            console.log("Error adding data to sheet ", error)
        }
    }

}