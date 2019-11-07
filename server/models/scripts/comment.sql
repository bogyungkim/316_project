CREATE TABLE comment (
  cid INTEGER NOT NULL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(uid),
  vote INTEGER NOT NULL,
  cContext VARCHAR(150) NOT NULL,
  report INTEGER,
  netid VARCHAR(32),
  deletedAt TIMESTAMP default NULL,
  FOREIGN KEY (netid) REFERENCES users(netid)
);