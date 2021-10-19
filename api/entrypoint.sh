#!/bin/sh

echo "starting migrate"
python manage.py makemigrations
python manage.py migrate --noinput

echo "starting collectstatic"
python manage.py collectstatic --no-input --clear

exec "$@"