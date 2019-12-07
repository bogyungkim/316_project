drop table if exists flag, comment, post, channel, users;

CREATE TABLE users (
  uid INTEGER NOT NULL PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  phoneNumber CHAR(10) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  clout INTEGER NOT NULL, --will delete clout ;)
  deletedAt TIMESTAMP default NULL
);


CREATE TABLE channel (
  chid INTEGER NOT NULL PRIMARY KEY,
  cname VARCHAR(30) NOT NULL
);

CREATE TABLE post (
  pid INTEGER NOT NULL,
  chid INTEGER NOT NULL REFERENCES channel(chid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  title VARCHAR(50) NOT NULL,
	detail VARCHAR(150) NOT NULL,
  photoUrl VARCHAR(2000) NOT NULL,
  upVote INTEGER NOT NULL,
  downVote INTEGER NOT NULL,
  deletedAt TIMESTAMP default NULL,
  PRIMARY KEY (pid, chid),
  UNIQUE(pid)
);

CREATE TABLE comment (
  cid INTEGER NOT NULL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(uid),
  pid INTEGER NOT NULL REFERENCES post(pid),
  context VARCHAR(150) NOT NULL,
  deletedAt TIMESTAMP default NULL
);

CREATE TABLE flag (
  pid INTEGER NOT NULL REFERENCES post(pid),
  num INTEGER NOT NULL,
  PRIMARY KEY (pid),
  UNIQUE(pid)
);
