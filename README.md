# backend
Backend for movie-web

## Todo list
 - [X] standard endpoints:
  - [X] make account (PFP, account name)
  - [X] login (Pending Actual Auth)
  - [X] logout a session
  - [X] read all sessions from logged in user
  - [X] edit current session device name
  - [X] edit account name and PFP
  - [X] delete logged in user
  - [X] backend meta (name and description)
  - [X] upsert settings
  - [X] upsert progress items
  - [X] upsert bookmarks
  - [X] GET bookmarks
  - [X] GET settings
  - [X] GET progress items
  - [X] DELETE progress items
  - [X] GET user with @me
  - [X] DELETE user - should delete all associated data
 - [X] prometheus metrics
  - [X] requests
  - [X] user count
 - [X] switch to pnpm
 - [X] catpcha support
 - [X] global namespacing (accounts are stored on a namespace)
 - [X] cleanup jobs
  - [X] cleanup expired sessions
 - [ ] ratelimits (stored in redis)
 - [ ] provider metrics
  - [ ] cleanup old metrics in DB
  - [ ] endpoint to consume and store metrics
  - [ ] pass metrics to prometheus

## Second todo list
 - [ ] think of privacy centric method of auth
  - [ ] Register
  - [ ] Login
