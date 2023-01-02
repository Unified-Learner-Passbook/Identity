FROM node:16 as dependencies
WORKDIR /app
COPY . ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
