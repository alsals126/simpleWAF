package ip

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	echo "github.com/labstack/echo"
	_ "github.com/lib/pq"
)

func dbConnection() *sql.DB {
	var dbinfo = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		"jeongmin", "1234asdf#$", "jeongmindb")
	var db *sql.DB

	var err error
	db, err = sql.Open("postgres", dbinfo)
	if err != nil {
		return nil
	}
	return db
}

func GetIpProxy(c echo.Context) error {
	db := dbConnection()

	rows, err := db.Query("SELECT * FROM ipproxy")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var ip, time string

		err := rows.Scan(&ip, &time)
		if err != nil {
			return errors.New("DB ERROR2")
		}
	}

	return c.String(http.StatusOK, "SUCCESS!\n")
}
func AddIpProxy(c echo.Context) error {
	db := dbConnection()

	fmt.Println(c.Request().Form)
	ip := c.FormValue("ip")
	_, err := db.Exec("INSERT INTO ipproxy(ip, time) VALUES($1, $2)", ip, time.Now())
	if err != nil {
		return errors.New("DB ERROR")
	}

	return c.String(http.StatusOK, "SUCCESS!\n")
}
func DeleteIpProxy(c echo.Context) error {
	db := dbConnection()

	id := c.Param("id")
	_, err := db.Exec("DELETE FROM ip WHERE id=$1", id)
	if err != nil {
		return errors.New("DB ERROR")
	}
	return c.String(http.StatusOK, "SUCCESS!\n")
}
