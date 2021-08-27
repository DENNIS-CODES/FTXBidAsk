import ExcelJs from 'exceljs';

const workbook = new ExcelJs.Workbook();
const doc_name: string = 'DataSheet'

export class ExcelSheet {
    sheet: any
    
    constructor() {
        this.sheet = workbook.addWorksheet(doc_name)
    }

    setup = async () => {
        this.sheet.columns = [
            {header: 'Bid Price', key: 'bid_price'},
            {header: 'Ask Price', key: 'ask_price'},
        ]
    }

    add_row_usd = async (record:any[]) => {
        await this.sheet.addRow(record)

        await workbook.xlsx.writeFile(`BTCUSD.xlsx`).then(() => console.log('File saved')
        )
    }
    add_row_perp = async (record:any[]) => {
        await this.sheet.addRow(record)

        await workbook.xlsx.writeFile(`BTCPERP.xlsx`).then(() => console.log('File saved')
        )
    }
}