# PowerBank Server

Ignore node_modules
```
$ echo "node_modules" >> .gitignore
$ git rm -r --cached node_modules
$ git commit -am 'untracked node_modules'
```

Enable verbose logging
```
$ heroku config:set NPM_CONFIG_LOGLEVEL=verbose
$ git commit -am 'verbose logging' --allow-empty
$ git push heroku master
```

Set the buildpack.
```
$ heroku buildpacks:set heroku/php
```

## Deploying to Heroku

Create an app without a name.
```
$ heroku create
```
In this case the app is created at the following endpoint:
 https://protected-harbor-3410.herokuapp.com/

Push to heroku.
```
$ git push heroku master
$ heroku open
```

In this case
