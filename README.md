## Setup postgres
Download and install postgres through homebrew: `brew install postgresql` or
from the website here: http://www.postgresql.org/download/.

You can then boot up your postgres installation by using the following command
in your terminal: `pg_ctl -D /usr/local/var/postgres -l logfile stop`
The path after the `-D` parameter can vary based on how you installed postgres,
I found this path to work as I installed postgres through homebrew.

Afterwards you have to make sure you can connect to the database through the
default postgres user, this can be done by writing the following in your
terminal: `psql -U postgres`, which should succeed. If it doesn't, then you're
probably missing the default user, which can then instead be created by entering
`createuser -s -r postgres`.

Afterwards you have to login as that user and create a database needed to work
maecen (same command as when you checked if the user existed), and then you type
in: `CREATE DATABASE maecen`.

Finally you enter the following in your `.env` file to connect the application
with the database:
```
SQL_DATABASE_CONNECTION=postgresql://postgres@localhost:5433/maecen
```
Simple as that! (not)

## Localization from the old app to be added to this one
https://github.com/maecen/maecen-webapp/blob/development/client/assets/js/localization.js

## Start
`npm start`

## Migrate datebase
`npm run migrate:latest`

## Create new migration
`./node_modules/.bin/knex migrate:make maecenate-month-price`

## Actions

# Naming conventions
- All actions that ends with the _List_ (fetchMaecenateList) creates an action
  which should treat the list of id's it returns as the one that should be used
  to display on the page.
