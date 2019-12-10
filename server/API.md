# API Specs

* Response code is 200 if success and 400 if failure

* Response is omitted if it's not that useful to the client

## User API

### Create User

[POST] /users

Request Body
```json
{
    "statusCode": 200,
    "result": {
        "uid": 1,
        "username": "amykim",
        "phonenumber": "9195648686",
        "password": "$2a$08$.KaI9igs3PgbH/.ZvJTY7uxH/3QysSnSVFSdRs2wEQAOxx.6OvHJu",
        "clout": 0,
        "deletedat": null
    }
}
```

Response body
```json
{
    "statusCode": 200,
    "result": {
        "uid": 1
    }
}
```

### Login

[POST] /login

Request Body
```json
{
	"id": "amykim",
	"password": "iamamy"
}
```

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "uid": 1,
        "username": "amykim",
        "phonenumber": "9195648686",
        "password": "$2a$08$.KaI9igs3PgbH/.ZvJTY7uxH/3QysSnSVFSdRs2wEQAOxx.6OvHJu",
        "clout": 0,
        "deletedat": null
    }
}
```

### Get User

[GET] /users/:user_id

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "uid": 1,
        "username": "amykim",
        "phonenumber": "9195648686",
        "password": "$2a$08$.KaI9igs3PgbH/.ZvJTY7uxH/3QysSnSVFSdRs2wEQAOxx.6OvHJu",
        "clout": 0,
        "deletedat": null
    }
}
```

## Channel API

### Create Channel

[POST] /channels

Request Body
```json
{
	"cname": "transportation"
}
```

Response Body
```json
{
    "chid": 4
}
```

### Get All Channels

[GET] /channels

Response Body
```json
{
    "statusCode": 200,
    "result": [
        {
            "chid": 1,
            "cname": "general"
        },
        {
            "chid": 2,
            "cname": "social"
        },
        {
            "chid": 3,
            "cname": "food"
        },
        {
            "chid": 4,
            "cname": "transportation"
        }
    ]
}
```

## Post API

### Create Post

[POST] /posts

Request Body
```json
{
    "chid": 1,
    "uid": 1,
    "title": "post",
    "detail": "detail",
    "photoUrl": "http://www.naver.com"
}
```

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "pid": 1
    }
}
```

### Get Posts for channel

[GET] /posts/:channel_id

> upVotes, downVotes, flags are a list of user IDs

Response Body
```json
{{
    "statusCode": 200,
    "results": [
        {
            "pid": 1,
            "chid": 1,
            "uid": 2,
            "title": "hello",
            "detail": "post1",
            "photourl": "null",
            "deletedat": null,
            "upVotes": [],
            "downVotes": [
                2
            ],
            "flags": [
                2
            ]
        },
        {
            "pid": 2,
            "chid": 1,
            "uid": 2,
            "title": "hello2",
            "detail": "post2",
            "photourl": "null",
            "deletedat": null,
            "upVotes": [
                2
            ],
            "downVotes": [],
            "flags": []
        }
    ]
}
```

### Toggle upvote on a post

[POST] /posts/:post_id/upVote/:uid

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "isUpVote": true,
        "isDownVote": false
    }
}
```

### Toggle downvote on a post

[POST] /posts/:post_id/downVote/:uid

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "isUpVote": false,
        "isDownVote": true
    }
}
```

### Toggle flag on a post

[POST] /posts/:post_id/flag/:uid

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "exists": true,
        "banned": false
    }
}
```

## Comment API

### Create comment

[POST] /comments

Request Body
```json
{
    "statusCode": 200,
    "result": {
        "uid": 1,
        "pid": 3,
        "context":"yayyyyy"
    }
}
```

Response Body
```json
{
    "statusCode": 200,
    "result": {
        "cid": 5
    }
}
```

### Get comments for post

[GET] /comments/:post_id

Response Body
```json
{
    "statusCode": 200,
    "result": [
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
}
```

### Upload files to S3

[POST] /upload

##### Response Body
```json
{
  "name": "filename",
  "data": "base64 string"
}
```
##### Response (success)
```json
{
  "statusCode": 200,
  "result": "url"
}
```
##### Response (fail - parameter error)
```json
{
  "statusCode": 400,
  "triggeredAt": "s3.upload()",
  "error": "error"
}
```
##### Response (fail - server error)
```json
{
  "statusCode": 500,
  "triggeredAt": "s3.upload()",
  "error": "error"
}
```