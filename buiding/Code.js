
function doGet() {
  return HtmlService.createTemplateFromFile("stock").evaluate()
}


function onSubmit(name) {
  Logger.log(name)
  return 100
}

/* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
/* @Process Form */
function newStockIssuance(req) {
  console.log(req)
  var url = "https://docs.google.com/spreadsheets/d/1JGlW1v2D2Zaj6qf_47654LRIFzs18zlCbAICjmykPQE/edit#gid=626867041";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Stock Issuance");
  
  ws.appendRow([req.issueDate,
    req.item,
    "unit",
    req.quantity,
    req.to]);
}

/* @Process Form */
function stockIssuanceList() {
  var url = "https://docs.google.com/spreadsheets/d/1JGlW1v2D2Zaj6qf_47654LRIFzs18zlCbAICjmykPQE/edit#gid=626867041";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Stock Issuance");
  
  var values = ws.getDataRange().getValues()
  
  var startOfWeek = getStartOfLastWeek();

  retval = values.filter(row => isLater(row[0], startOfWeek)? true: false)
                  .map((row, index) => ({rowIndex: index, issueDate: DateToYYYYMMDD(row[0]), item: row[1], unit: row[2], quantity: row[3], to: row[4]}))
                  .sort((a,b) => a['issueDate'] < b['issuedate']? 1 : (a['issueDate'] > b['issueDate']? -1 : b['rowIndex'] - a['rowIndex']))
  
  console.log(retval)

  return retval
}


/* @Process Form */
function inventoryList() {
  var url = "https://docs.google.com/spreadsheets/d/1JGlW1v2D2Zaj6qf_47654LRIFzs18zlCbAICjmykPQE/edit#gid=626867041";
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Inventory");
  
  var range = ws.getRange(2,1,200,3).getValues()
  
  retval = range.filter(row => row[0]? true: false).map(row => ({name: row[0], unit: row[1], category: row[2]}))

  return retval
}


function getStartOfLastWeek() {
  var d = new Date();   
  var day = d.getDay() === 0? 7 : d.getDay()
  d.setDate(d.getDate() - day - 7 + 1 )
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}
