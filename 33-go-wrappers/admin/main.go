// The admin service: Gin, whose Use runs only on the routes registered after it, and whose
// groups run the middleware they are made with.
package main

import "github.com/gin-gonic/gin"

func audit(c *gin.Context)        { c.Next() }
func requireAdmin(c *gin.Context) { c.Next() }
func healthz(c *gin.Context)      {}
func stats(c *gin.Context)        {}

func main() {
	r := gin.New()
	// Registered before Use: /healthz never runs audit.
	r.GET("/healthz", healthz)
	r.Use(audit)
	admin := r.Group("/admin", requireAdmin)
	admin.GET("/stats", stats)
	_ = r.Run(":9090")
}
