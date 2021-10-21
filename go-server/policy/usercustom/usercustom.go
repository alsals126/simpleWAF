package usercustom

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
	var ips []models.UserCustom
	db := middleware.DbConnection()

	rows, err := db.Query("SELECT * FROM proxy_usercustom")
	if err != nil {
		return errors.New("DB ERROR1")
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var field string
		var rule string
		var policy string

		err := rows.Scan(&id, &field, &rule, &policy)
		if err != nil {
			return errors.New("DB ERROR2")
		}
		ips = append(ips, models.UserCustom{
			Id:     id,
			Field:  field,
			Rule:   rule,
			Policy: policy,
		})
	}

	return c.JSON(http.StatusOK, ips)
}
func AddPolicy(c echo.Context) error {
	db := middleware.DbConnection()

	fmt.Println(c.Request().Form, "user")
	field := c.FormValue("field")
	rule := c.FormValue("rule")
	policy := c.FormValue("policy")
	_, err := db.Exec("INSERT INTO proxy_usercustom(field, rule, policy) VALUES($1, $2, $3)", field, rule, policy)
	if err != nil {
		return errors.New("DB ERROR")
	}

	return c.String(http.StatusOK, "SUCCESS!\n")
}
func DeletePolicy(c echo.Context) error {
	db := middleware.DbConnection()

	id := c.Param("id")
	_, err := db.Exec("DELETE FROM proxy_usercustom WHERE id=$1", id)
	if err != nil {
		return errors.New("DB ERROR")
	}
	return c.String(http.StatusOK, "SUCCESS!\n")
}
