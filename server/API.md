# API Specs

* Response code is 200 if success and 400 if failure

* Response is omitted if it's not that useful to the client

## User API

### Create User

[POST] /users

Request Body
```json
{
    "username": "amykim",
    "phoneNumber": "0000000000",
    "password": "passpass",
    "clout": 0
}
```

Response body
```json
{
    "uid": 6
}
```

### Login

[POST] /login

Request Body
```json
{
	"id": "amykim",
	"password": "passpass"
}
```

Response Body
```json
{
    "uid": 1,
    "username": "amykim",
    "phonenumber": "0000000000",
    "password": "$2a$08$G2Diodbt0XzSfN0MEgTO..ze.XbbtK59yyD6bSqSkhvgTfLpQSvTO",
    "clout": 0,
    "deletedat": "2019-12-08T04:31:36.487Z"
}
```

### Get User

[GET] /users/:user_id

Response Body
```json
{
    "uid": 1,
    "username": "amykim",
    "phonenumber": "0000000000",
    "password": "$2a$08$G2Diodbt0XzSfN0MEgTO..ze.XbbtK59yyD6bSqSkhvgTfLpQSvTO",
    "clout": 0,
    "deletedat": "2019-12-08T04:31:36.487Z"
}
```

## Channel API

### Create Channel

[POST] /channels

Request Body
```json
{
	"cname": "food"
}
```

Response Body
```json
{
	"chid": 5
}
```

### Get All Channels

[GET] /channels

Response Body
```json
[
    {
        "chid": 1,
        "cname": "eat"
    },
    {
        "chid": 2,
        "cname": "code"
    },
]
```

## Post API

### Create Post

[POST] /posts

Request Body
```json
{
    "chid": 1,
    "uid": 1,
    "title": "title",
    "detail": "detail",
    "photoUrl": "http://www.naver.com"
}
```

Response Body
```json
{
	"pid": 2
}
```

### Get Posts for channel

[GET] /posts/:channel_id

Response Body
```json
[
    {
        "pid": 4,
        "chid": 1,
        "uid": 1,
        "title": "title",
        "detail": "detail",
        "photourl": "http://www.naver.com",
        "upvote": 0,
        "downvote": 0,
        "deletedat": null,
        "flag": 0
    }
]
```

### Upvote a post

[POST] /posts/:post_id/upVote

Response Body
```json
{
  "newUpVote": 2
}
```

### Downvote a post

[POST] /posts/:post_id/downVote

Response Body
```json
{
  "newDownVote": 1
}
```

### Flag a post

[POST] /posts/:post_id/flag

Response Body
```json
{
  "newFlag": 2,
  "banned": false
}
```

## Comment API

### Create comment

[POST] /comments

Request Body
```json
{
	"uid": 1,
	"pid": 3,
	"context":"yayyyyy"
}
```

Response Body
```json
{
	"cid": 5
}
```

### Get comments for post

[GET] /comments/:post_id

Response Body
```json
[
    {
        "cid": 2,
        "uid": 1,
        "pid": 4,
        "context": "yayyyyy",
        "deletedat": null
    },
    {
        "cid": 3,
        "uid": 1,
        "pid": 4,
        "context": "yoyyyyy",
        "deletedat": null
    }
]
```