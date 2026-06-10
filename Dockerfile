FROM denoland/deno:2.8.2

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno install --allow-scripts
RUN deno task build

EXPOSE 8000

CMD ["deno", "task", "start"]
