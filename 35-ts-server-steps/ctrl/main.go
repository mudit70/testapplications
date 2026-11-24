package main

import (
	"net/http"

	"example.com/ctrl/gen/ctrlv1connect"
	"example.com/ctrl/services/deployment"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle(ctrlv1connect.NewDeployServiceHandler(deployment.New()))
	http.ListenAndServe(":7091", mux)
}
