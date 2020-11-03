
function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function isLater(date1, date2) {
  if (isValidDate(date1)) {
    return date1 > date2
  }
  
  return false
}

function DateToYYYYMMDD(d) {
    const month = d.getMonth() + 1  
    const pad = (n) => n < 10? "0" + n : "" + n

    return d.getFullYear() +  pad(month) + pad(d.getDate())
}

const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function DateToDDMMMYYYY(d) {
    return d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear()
}