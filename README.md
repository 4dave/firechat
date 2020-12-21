# firechat

### contribute:

- fork repo
- clone  
  ex: `git clone git@github.com:<yourorg>/firechat.git`
- npm install  
  `npm install` (to install dependencies)
- create branch  
  ex: `git checkout -b <branchname>`
- test app  
  `npm start` should launch http://localhost:3000 with a working app
- make changes, commit, push  
  ex: `git push origin <branchname>`
- create pr
  - go to your forked repo
  - create pull request
  - make sure your head branch (what you just updated) matches the base branch of the origin repo

#### notes:

- npm registry set to: `registry = "https://registry.npmjs.org/"`
- firebase cloud firestore database collection: `messages`  
  the documents contain:
  - "createdAt" (date/timestamp)
  - "photoURL" (google account avatar)
  - "text" (the chat text)
  - "uid" (user id)
