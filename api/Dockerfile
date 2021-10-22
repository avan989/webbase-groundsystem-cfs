###########
# BUILDER #
###########

# pull official base image
FROM python:3.7.0-alpine as builder

# set work directory
WORKDIR /usr/src/app

# lint, coding style check against PEP8, programming errors, and cyclomatic complexity.
RUN pip install flake8
COPY . /usr/src/app/
RUN flake8 --ignore=E501,F401 .

#########
# FINAL #
#########

# pull official base image
FROM python:3.7.0-alpine

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# create directory for the app user
RUN mkdir -p /home/app/

# create static folder
RUN mkdir -p /home/app/static_cdn/
RUN mkdir -p /home/app/media_cdn/

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=$HOME/api

RUN mkdir -p $HOME/static_cdn/
RUN mkdir -p $HOME/media_cdn/
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

RUN apk update \
  && apk add build-base libffi-dev gcc python3-dev musl-dev

COPY ./requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy entrypoint-prod.sh
COPY ./entrypoint.sh $APP_HOME

# copy project
ADD . $APP_HOME

# create the app user
RUN addgroup -S app && adduser -S app -G app

# chown all the files to the app user
RUN chown -R app:app $HOME

# change to the app user
USER app

# run entrypoint.prod.sh
ENTRYPOINT ["/home/app/api/entrypoint.sh"]