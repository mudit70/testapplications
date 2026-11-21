FROM rust:1.82 AS build
WORKDIR /src
COPY . .
# sqlx's query! macros check against the prepared queries in .sqlx (cargo sqlx prepare).
ENV SQLX_OFFLINE=true
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=build /src/target/release/payments /usr/local/bin/payments
EXPOSE 8090
CMD ["payments"]
