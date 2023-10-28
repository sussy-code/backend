# backend
Backend for movie-web

## Todo list
 - [ ] standard endpoints:
  - [ ] make account (PFP, account name)
  - [ ] login
  - [X] logout a session
  - [ ] read all sessions from logged in user
  - [ ] edit current session device name
  - [ ] edit account name and PFP
  - [ ] delete logged in user
  - [ ] backend meta (name and description)
  - [ ] upsert settings
  - [ ] upsert watched items
  - [ ] upsert bookmarks
  - [ ] consume provider metrics
 - [ ] prometheus metrics
  - [ ] requests
  - [ ] user count
  - [ ] provider metrics
 - [ ] ratelimits (stored in redis)
 - [ ] switch to pnpm
 - [ ] think of privacy centric method of auth
 - [ ] global namespacing (accounts are stored on a namespace)
