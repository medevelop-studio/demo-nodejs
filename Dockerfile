FROM node:14.11-alpine3.12

RUN apk add --update postgresql-client

RUN apk add redis

COPY work.sh /root/work.sh

COPY parseCSV.js /root/parsecsv.js

RUN chmod 777 /root/parsecsv.js

RUN echo "* * * * * /bin/ash /root/work.sh" | crontab -

CMD ["crond","-f"]


