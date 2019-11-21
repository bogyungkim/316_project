BACKEND TEAM
## How to install

```
npm install
```

## How to run

```
npm start
```

## sql file to create tables & insert dummy values

```
models/scripts/fill.sql
```

## how to hash and compare password

```$xslt
import bcrypt from 'bcrypt';

const password = 'Hello, World!';
const saltRounds = 10;

# hash method
bcrypt.hash(password, saltRounds, (err, hash) => {
    // fill out
    // return value - string
});

# compare method
bcrypt.compare(password, hash, (err, result) => {
    // fill out
    // return value - boolean
});
```
> Please make sure to use await/async when using the method.