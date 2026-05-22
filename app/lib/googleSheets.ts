import { GoogleSpreadsheet } from 'google-spreadsheet'

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!)

export async function initSheet() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  })
  await doc.loadInfo()
}

export async function getSheetData(sheetName: string) {
  await initSheet()
  const sheet = doc.sheetsByTitle[sheetName]
  const rows = await sheet.getRows()
  return rows.map(row => row._rawData)
}

export async function appendToSheet(sheetName: string, data: any[]) {
  await initSheet()
  const sheet = doc.sheetsByTitle[sheetName]
  await sheet.addRow(data)
}

export async function updateSheetRow(sheetName: string, rowIndex: number, data: any[]) {
  await initSheet()
  const sheet = doc.sheetsByTitle[sheetName]
  const rows = await sheet.getRows()
  const row = rows[rowIndex]
  data.forEach((value, index) => {
    row._rawData[index] = value
  })
  await row.save()
}
