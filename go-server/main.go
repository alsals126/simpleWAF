package main

import (
	"simpleWAF/policy/ipblock"
	"simpleWAF/policy/log"
	"simpleWAF/policy/usercustom"

	echo "github.com/labstack/echo"
	middleware "github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.GET("/ip-block", ipblock.GetPolicy)
	e.POST("/ip-block", ipblock.AddPolicy)
	e.DELETE("/ip-block/:id", ipblock.DeletePolicy)

	e.GET("/user-custom", usercustom.GetPolicy)
	e.POST("/user-custom", usercustom.AddPolicy)
	e.DELETE("/user-custom/:id", usercustom.DeletePolicy)

	e.GET("/log", log.Log)

	// Start Server
	e.Start(":8080")
}
