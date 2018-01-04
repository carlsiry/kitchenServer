
/**
 *  数据库操作服务
 */

import * as couchbase from 'couchbase';
import { Component } from '@nestjs/common';
import { config } from '../config/config.provider';

// 取得环境配置并赋给常量
// 本地数据库
let localEnvironment = true;

let endPoint: string = config.couchbase.endPoint;
let username: string = config.couchbase.username;
let password: string = config.couchbase.password;
let bucketName: string = config.couchbase.bucket;
let showQuery: boolean = config.couchbase.showQuery;

if (localEnvironment) {
    endPoint = config.localCouchbase.endPoint;
    username = config.localCouchbase.username;
    password = config.localCouchbase.password;
    bucketName = config.localCouchbase.bucket;
    showQuery = config.localCouchbase.showQuery;
}

// 配置sql语句查询对象
const N1qlQuery = couchbase.N1qlQuery;

// 与数据库服务器建立连接
const cluster: any = new couchbase.Cluster(endPoint);
cluster.authenticate(username, password);

// 打开数据库
export const bucket: any = cluster.openBucket(bucketName, (err) => {
    if (err) {
        console.log('服务器连接发生错误啦！')
        throw err;
    } else {
        console.log('couchbase服务器连接成功！')
    }
});


@Component()
export class DbService {

    /**
     * 执行n1ql语句，返回结果
     * @param sql语句
     *
     */
    query(sql: string) {
        if (showQuery) {
            console.log('QUERY -->', sql);
        }
        //查询sql语句
        var query = N1qlQuery.fromString(sql);

        return new Promise((resolve, reject) => {
            bucket.query(query, (error, data) => {
                if (error) {
                    console.log('查询出错了……');
                    reject(error);
                }
                resolve(data);
            });
        });
    }

    /**
     * 根据ID获取文档
     * @param key
     *
     */
    getById(key: string) {
        return new Promise((resolve, reject) => {
            bucket.get(key, (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            })
        })
    };


    /**
     * 向数据库中插入或更新文档
     * @param key  文档id
     * @param val  文档内容
     */
    upsert(key, val) {
        return new Promise((resolve, reject) => {
            bucket.upsert(key, val, (error, data) => {
                if (error) {
                    console.log("DB.UPSERT:", key, ":", error);
                    reject(error);
                } else {
                    bucket.get(key, (error, data) => {
                        resolve(data.value)
                    });
                }
            })
        });
    }

    /**
     * 删除文档
     * @param key  文档id
     */
    docDelete(key) {
        return new Promise((resolve, reject) => {
            bucket.remove(key, (err, result) => {
                if (err) {
                    console.log("DB.DELETE:", err);
                    reject(err);
                }
                resolve(result);
            });
        });
    };

}
