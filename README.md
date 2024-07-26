该项目是基于 Blocklet 的 Express + Vue3 为模板开发，使用 sqlite 做存储。

引入了 环境变量 DB_FILE，设置数据库的存储路径，默认 `./api/db.sqlite`

启动方式
请先设置好 blocklet 环境

```
export DB_FILE="./abc.sqlite"  && blocklet dev
会输出如下内容
...
ℹ You can access with the following URL

- http://bhqaws5wytimqfpa55z2hx54euyipdftncmvtd3ubde-192-168-1-108.ip.abtnet.io
```

该地址打开就是一个 profile 页（数据在 dev 模式下，会按需填充）

### 接口

#### 返回格式

数据的返回格式是统一的

```
{
    "state": "ok",
    "msg": "",
    "data": obj，
}
// state 如果不为 'ok' 则有异常
// msg 是异常信息
// data 当没有异常时，正常返回的数据会在这个里面
// 例如
{
    "state": "ok",
    "msg": "",
    "data": {
        "id": 1,
        "name": "张三",
        "birth_day": "1990-01-15",
        "gender": 1,
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "home_address": "北京市朝阳区某街道1号",
        "work_address": "北京市海淀区某大厦15层",
        "created_at": "2024-07-26 05:30:21"
    }
}
```

#### user 列表

```
GET /api/user/list?start=0&step=5
默认打开分页功能
start 为起始 id（含）， 默认 0
step 为查询条数， 默认 10
返回示例
{
    "state": "ok",
    "msg": "",
    "data": [
        {
            "id": 1,
            "name": "张三",
            "birth_day": "1990-01-15",
            "gender": 1,
            "email": "zhangsan@example.com",
            "phone": "13800138000",
            "home_address": "北京市朝阳区某街道1号",
            "work_address": "北京市海淀区某大厦15层",
            "created_at": "2024-07-26 05:30:21"
        }
    ]
}
```

#### user 详情

```
GET /api/user/info/:uid
返回示例
{
    "state": "ok",
    "msg": "",
    "data": {
        "id": 1,
        "name": "张三",
        "birth_day": "1990-01-15",
        "gender": 1,
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "home_address": "北京市朝阳区某街道1号",
        "work_address": "北京市海淀区某大厦15层",
        "created_at": "2024-07-26 05:30:21"
    }
}
```

#### user 创建

```
POST /api/user/create
{
  "name": "张三",   // 长度介于 1 和 32 之间，必选
  "birth_day": "1990-01-15", // 必选 需符合格式要求
  "gender": 1, // 必选 0 男， 1 女
  "email": "zhangsan@example.com", // 必选 需符合格式要求
  "phone": "13800138000", // 必选 需符合格式要求
  "home_address": "北京市朝阳区某街道1号", // 可选
  "work_address": "北京市海淀区某大厦15层" // 可选
}
返回示例
{
    "state": "ok",
    "msg": "",
    "data": {
        "id": 2   // 新建的数据 id
    }
}
```

#### user 更新

```
POST /api/user/update/:uid
{
  "name": "张三",
  "birth_day": "1990-01-15",
  "gender": 1,
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "home_address": "北京市朝阳区某街道1号",
  "work_address": "北京市海淀区某大厦15层"
}

格式要求与 insert 时保持一致，但是传递的参数并不都是必选，传递几个就更新几个

正常返回示例
{
    "state": "ok",
    "msg": ""
}
异常返回示例
{
    "state": "ValidationError",
    "msg": "\"email\" must be a valid email"
}
```
