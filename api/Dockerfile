###########
# BUILDER #
###########

# pull official base image
FROM python:3.7.0-alpine as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

# lint, coding style check against PEP8, programming errors, and cyclomatic complexity.
RUN pip install flake8
COPY . /usr/src/app/
RUN flake8 --ignore=E501,F401 .

# install dependencies
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

#########
# FINAL #
#########

# pull official base image
FROM python:3.7.0-alpine

# For Pillow
RUN apk add --no-cache jpeg-dev zlib-dev

# create directory for the app user
RUN mkdir -p /home/app/

# create static folder
RUN mkdir -p /home/app/static_cdn/
RUN mkdir -p /home/app/media_cdn/

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=$HOME/web

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# install dependencies
RUN apk update && apk add libpq
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip
RUN pip install /wheels/*

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
ENTRYPOINT ["/home/app/web/entrypoint.sh"]