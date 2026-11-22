FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /inventory .

FROM alpine:3.20
COPY --from=build /inventory /inventory
EXPOSE 8080
ENTRYPOINT ["/inventory"]
