package main

import (
	"simpleWAF/go-server/ip"

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
	e.GET("/ip-proxy", ip.GetIpProxy)
	e.POST("/ip-proxy", ip.AddIpProxy)
	e.DELETE("/ip-proxy/:id", ip.DeleteIpProxy)

	// Start Server
	e.Start(":8080")
}
