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
