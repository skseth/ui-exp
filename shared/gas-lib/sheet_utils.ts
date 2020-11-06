// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function openSheet(
  si_url: string,
  sheetName: string
): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.openByUrl(si_url)
  const ws = ss.getSheetByName(sheetName)
  if (ws === null) {
    throw `Error - could not get sheet ${sheetName}`
  }

  return ws
}
