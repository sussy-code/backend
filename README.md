# backend
Backend for movie-web

## Todo list
 - [ ] standard endpoints:
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
  - [ ] consume provider metrics
  - [ ] DELETE user - should delete all associated data
 - [ ] prometheus metrics
  - [ ] requests
  - [ ] user count
  - [ ] provider metrics
 - [ ] ratelimits (stored in redis)
 - [X] switch to pnpm
 - [X] catpcha support
 - [X] global namespacing (accounts are stored on a namespace)
 - [ ] cleanup jobs
  - [ ] cleanup expired sessions
  - [ ] cleanup old metrics

## Second todo list
 - [ ] think of privacy centric method of auth
  - [ ] Register
  - [ ] Login
