package api

import (
	"net/http"
	"simpleWAF/go-server/ip"

	echo "github.com/labstack/echo"
	middleware "github.com/labstack/echo/middleware"
)

func APIServer() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!\n")
	})
	e.GET("/ip-proxy", ip.GetIpProxy)
	e.POST("/ip-proxy", ip.AddIpProxy)
	e.DELETE("/ip-proxy/:id", ip.DeleteIpProxy)

	// Start Server
	e.Start(":8080")
}
