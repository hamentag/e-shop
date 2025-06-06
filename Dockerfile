# ----------- Build Frontend ------------
FROM node:20 AS frontend

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build

# ----------- Build Backend ------------
FROM node:20 AS backend

WORKDIR /app

# Copy backend package.json and install
COPY package*.json ./
RUN npm install

# Copy backend source
COPY . .

# Copy built frontend to backend public
COPY --from=frontend /app/client/dist ./client/dist

# Set environment variable
ENV NODE_ENV=production

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["npm", "run", "start:dev"]
#CMD ["npm", "run", "start"]
