package policydb

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"simpleWAF/middleware"

	echo "github.com/labstack/echo"
	_ "github.com/lib/pq"
)

type IP struct {
	Id     int
	Ip     string
	Time   time.Time
	Policy string
}
type IPs struct {
	Ips []IP
}

func GetPolicy(c echo.Context) error {
	var ips []IP
	db := middleware.DbConnection()

	rows, err := db.Query("SELECT * FROM ipproxy")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var ip string
		var time time.Time
		var policy string

		err := rows.Scan(&id, &ip, &time, &policy)
		if err != nil {
			return errors.New("DB ERROR2")
		}
		ips = append(ips, IP{
			Id:     id,
			Ip:     ip,
			Time:   time,
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
	_, err := db.Exec("INSERT INTO ipproxy(ip, time, policy) VALUES($1, $2, $3)", ip, time.Now(), policy)
	if err != nil {
		return errors.New("DB ERROR")
	}

	return c.String(http.StatusOK, "SUCCESS!\n")
}
func DeletePolicy(c echo.Context) error {
	db := middleware.DbConnection()

	id := c.Param("id")
	_, err := db.Exec("DELETE FROM ipproxy WHERE id=$1", id)
	if err != nil {
		return errors.New("DB ERROR")
	}
	return c.String(http.StatusOK, "SUCCESS!\n")
}
