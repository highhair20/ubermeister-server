# Random Notes

## Project setup

Initialize the app.
```
git init
heroku create
```
In this case the app is created at the following endpoint:
 https://nameless-wave-8608.herokuapp.com

Ignore node_modules.
```
$ echo "node_modules" >> .gitignore
$ git rm -r --cached node_modules
$ git commit -am 'untracked node_modules'
$ git push heroku master
```

Open the app in your default browser.
```
$ heroku open
```

## Project Design

REST url example from github

- user_url: https://api.github.com/users/highhair20
- commits_url: https://api.github.com/repos/highhair20/glo/commits{/sha}

Extending the above example we would have the following:
- list of users: /users - NOT FOUND
- user data:   /users/{userId}
- devices by user: /devices/{userId}
- specific device: /devices/{userId}/{deviceId}
- list of controllers: /controllers/{userId}
- list of sockets: /sockets/{userId}/{controllerId}/
- specific socket: /sockets/{userId}/{controllerId}/{socketId}


Full list of urls:

Home - show possible actions (/users, /controllers)
- GET /

Users
- GET /users - list all users
- GET /users/{userId} - get a single user
- POST /users - Create a single user
- PUT /users/{userId} - update a single user
- DELETE /users/{userId} - remove a single user




'controller_id' : '5C5E3CDC-05FF-4014-9E28-F05C08319521',
'zone' : {
  id : 1,
  status : on
},
'zone' : {
  schedule
}
