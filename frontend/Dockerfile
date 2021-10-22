# pull the base image
FROM node:alpine

RUN mkdir -p /home/app/

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=$HOME/frontend

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# copy entrypoint.sh
COPY ./package.json $APP_HOME
COPY ./entrypoint.sh $APP_HOME

# dependencies
RUN npm install
RUN npm install react-scripts

# copy project
ADD . $APP_HOME

# create the app user
RUN addgroup -S app && adduser -S app -G app

# chown all the files to the app user
RUN chown -R app:app $HOME

# change to the app user
#USER app

# run entrypoint.prod.sh
#ENTRYPOINT ["/home/app/frontend/entrypoint.sh"]