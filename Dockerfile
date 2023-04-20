FROM node:16 as dependencies
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 3332
RUN npx prisma generate
CMD ["npm", "start"]
