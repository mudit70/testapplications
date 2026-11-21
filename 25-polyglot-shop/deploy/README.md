# deploy

Runs the shop locally: `docker compose up --build` from this directory. Each service is built
from its sibling repository (`../web`, `../orders`, `../inventory`, `../payments`); the
environment wires them together (`INVENTORY_URL=http://inventory:8080` for orders, the
`VITE_*_URL` build args for web) and to one Kafka broker.
