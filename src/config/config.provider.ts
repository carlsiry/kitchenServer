/**
 * 2018.01.04 增加本地数据库的调试配置信息
 */
export const config = {
    "couchbase": {
        "endPoint": "couchbase://123.207.174.171",
        // "endPoint": "couchbase://192.168.2.166",
        "bucket": "kitchendb",
        "username": "sun",
        "password": "123456",
        "showQuery": true
    },
    "localCouchbase": {
        "endPoint": "couchbase://127.0.0.1",
        "bucket": "travel-sample",
        "username": "Admin",
        "password": "123456",
        "showQuery": true
    },
    "application": {
        "hostAddress": "127.0.0.1",
        "httpPort": 3000,
        "hashToken": "UNSECURE_SECRET_TOKEN"
    },
    "appId": "wx86729b93283593dc",
    "appSecret": "",
}
