export function convertDateTime(date : string){
    let timestamp = Date.parse(date)
    let newDate = new Date(timestamp)
    return newDate.toDateString()
}