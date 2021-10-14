package main

import (
	"simpleWAF/policy/log"
	"simpleWAF/policy/policydb"

	echo "github.com/labstack/echo"
	middleware "github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()

	e.Static("/", "/ui/")
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.File("/", "ui/html/main.html")
	e.GET("/ip-proxy", policydb.GetPolicy)
	e.POST("/ip-proxy", policydb.AddPolicy)
	e.DELETE("/ip-proxy/:id", policydb.DeletePolicy)

	e.GET("/log/*", log.Log)

	// Start Server
	e.Start(":8080")
}
