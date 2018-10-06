# ap-cli

<!--[![NPM version](https://img.shields.io/npm/v/ap-cli.svg?style=flat)](https://www.npmjs.com/package/ap-cli)-->
[![npm version](https://badge.fury.io/js/ap-cli.svg)](http://badge.fury.io/js/ap-cli)
[![Build Status](https://travis-ci.org/PengChen96/ap-cli.svg?branch=master)](https://travis-ci.org/PengChen96/ap-cli)

### usage

##### data.json
```
[
  {
    "URI": "/api/get/index",
    "method": "get",
    "response": {
      ...
    }
  },
  {
    "URI": "/api/post/index",
    "method": "post",
    "response": {
      ...
    }
  }
]
```

##### 运行
```
$ ap-cli -m data.json
```
##### 查看接口
http://localhost:3000/api/get/index

### 参数
|#|缩写|完整|说明|
|--|----|------|------|
|1|-r|--regexp [regexp]|通过正则匹配需要mock的文件|
|2|-m|--mock [path]|指定mock的文件|
|3|-p|--port [port]|指定mock的端口|