FROM mhart/alpine-node:11 as build

ARG REACT_APP_DATA_HUB_URI
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_REALM

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn
COPY . .

ENV PATH /app/node_modules/.bin:$PATH
ENV SKIP_PREFLIGHT_CHECK true
ENV REACT_APP_DATA_HUB_URI $REACT_APP_DATA_HUB_URI 
ENV REACT_APP_KEYCLOAK_URL $REACT_APP_KEYCLOAK_URL
ENV REACT_APP_KEYCLOAK_REALM $REACT_APP_KEYCLOAK_REALM

RUN yarn build

FROM nginx:1.15.2-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
