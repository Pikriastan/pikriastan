FROM denoland/deno:2.8.2 AS build

WORKDIR /app

COPY . .
RUN deno install --allow-scripts
RUN deno task build

FROM denoland/deno:2.8.2 AS runtime

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY --from=build /app/deno.json /app/deno.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/_fresh ./_fresh
COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/lib/db/migrations ./lib/db/migrations

EXPOSE 8000

RUN deno task db:migrate

CMD ["deno", "task", "start"]
