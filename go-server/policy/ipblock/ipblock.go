package ipblock

import (
	"errors"
	"fmt"
	"net/http"

	"simpleWAF/middleware"
	"simpleWAF/models"

	echo "github.com/labstack/echo"
	_ "github.com/lib/pq"
)

func GetPolicy(c echo.Context) error {
	var ips []models.IPblock
	db := middleware.DbConnection()

	rows, err := db.Query("SELECT * FROM proxy_ipblock")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var ip string
		var policy string

		err := rows.Scan(&id, &ip, &policy)
		if err != nil {
			return errors.New("DB ERROR2")
		}
		ips = append(ips, models.IPblock{
			Id:     id,
			Ip:     ip,
			Policy: policy,
		})
	}

	return c.JSON(http.StatusOK, ips)
}
func AddPolicy(c echo.Context) error {
	db := middleware.DbConnection()

	fmt.Println(c.Request().Form)
	ip := c.FormValue("ip")
	policy := c.FormValue("policy")
	_, err := db.Exec("INSERT INTO proxy_ipblock(ip, policy) VALUES($1, $2)", ip, policy)
	if err != nil {
		return errors.New("DB ERROR")
	}

	return c.String(http.StatusOK, "SUCCESS!\n")
}
func DeletePolicy(c echo.Context) error {
	db := middleware.DbConnection()

	id := c.Param("id")
	_, err := db.Exec("DELETE FROM proxy_ipblock WHERE id=$1", id)
	if err != nil {
		return errors.New("DB ERROR")
	}
	return c.String(http.StatusOK, "SUCCESS!\n")
}
