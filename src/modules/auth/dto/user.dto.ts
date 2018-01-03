export interface User {
    id?          : string;
    birthday?    : Date;      //员工生日，需要转换成'yyyy-MM-dd'格式的字符串入库
    channelId?   : string;
    className?   : string;
    employeeName : string;
    enterTime?   : Date;      //入职时间;格式：2014-01-01
    leaveTime?   : Date;      //离职时间;格式2014-01-01
    level        : number;    //终端程序用户权限 1级：全部功能；2级：点餐、收银；3级：库管    
    mobile?      : string;
    passwd       : string;
    registedTime?: Date;
    sex          : string;
    state        : number;    //员工状态，1：正常；2：注销；3：其它
    stationsId?  : string[];
    userName     : string;
}