drop table if exists comment, post, channel, users cascade;

CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  phoneNumber CHAR(10) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  clout INTEGER NOT NULL, --will delete clout ;)
  deletedAt TIMESTAMP default NULL
);


CREATE TABLE channel (
  chid SERIAL PRIMARY KEY,
  cname VARCHAR(30) NOT NULL
);

CREATE TABLE post (
  pid SERIAL PRIMARY KEY,
  chid INTEGER NOT NULL REFERENCES channel(chid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  title VARCHAR(50) NOT NULL,
  detail VARCHAR(150) NOT NULL,
  photoUrl VARCHAR(2000) NOT NULL,
  deletedAt TIMESTAMP default NULL
);

CREATE TABLE votes (
  vid SERIAL PRIMARY KEY,
  pid INTEGER NOT NULL REFERENCES post(pid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  isUpVote BOOLEAN NOT NULL
)

CREATE TABLE flags (
  fid SERIAL PRIMARY KEY,
  pid INTEGER NOT NULL REFERENCES post(pid),
  uid INTEGER NOT NULL REFERENCES users(uid)
)

CREATE TABLE comment (
  cid SERIAL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(uid),
  pid INTEGER NOT NULL REFERENCES post(pid),
  context VARCHAR(150) NOT NULL,
  deletedAt TIMESTAMP default NULL
);