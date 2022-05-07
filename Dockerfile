FROM node:17
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
ENTRYPOINT [ "yarn", "dev" ]