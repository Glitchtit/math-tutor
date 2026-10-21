FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
# no npm dependencies: the app is static files plus the proxy in server.mjs
COPY package.json server.mjs index.html ./
COPY css css
COPY js js
COPY vendor vendor
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1
CMD ["node", "server.mjs"]
