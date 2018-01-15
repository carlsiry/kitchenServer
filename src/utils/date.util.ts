
/**
 * 格式化成连字符拼接的日期字符串： 年-月-日
 * @param date 日期对象
 * @return like 'yyyy-mm-dd'
 */
export const formatDate = (date: Date) => {
    let year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + month;
    }
    return '' + year + '-' + month + '-' + day;
};

/**
 * 格式化成具体时间的时间字符串：年-月-日 时：分：秒
 * @param date 日期对象
 * @return 'yyyy-mm-dd hh:mm:ss'
 */
export const formatCreatedTime = (date: Date) => {
    let dateStr = formatDate(date);
    let hour: any = date.getHours();
    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    } 
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return dateStr + ' ' + hour + ':' + minutes + ':' + seconds;
}
