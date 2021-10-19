package log

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"simpleWAF/middleware"
	"simpleWAF/models"

	echo "github.com/labstack/echo"
)

func Log(c echo.Context) error {
	var ips []models.IP
	db := middleware.DbConnection()

	// param인자: optional (ip, time)
	var result models.LogResult
	var err error

	qParams := c.QueryParams()
	if val, ok := qParams["ip"]; ok {
		result.Ip = val[0]
	}
	if val, ok := qParams["startDate"]; ok {
		result.StartDate, err = time.Parse("2006-01-02", val[0])
		if err != nil {
			log.Printf("DB ERRROR1 : %v\n", err)
			return err
		}
	}
	if val, ok := qParams["endDate"]; ok {
		result.EndDate, err = time.Parse("2006-01-02", val[0])
		if err != nil {
			log.Printf("DB ERRROR1 : %v\n", err)
			return err
		}
	}

	// where문 설정
	dbWhere := ""
	if result.Ip != "" {
		dbWhere += "WHERE ip LIKE '" + result.Ip + "%'"

		if whereTime(result) != "" {
			dbWhere += "AND " + whereTime(result)
		}
	} else {
		dbWhere += "WHERE " + whereTime(result)
	}
	fmt.Println(dbWhere)

	// 쿼리문
	rows, err := db.Query("SELECT ip, time, policy FROM ipproxy " + dbWhere)
	if err != nil {
		log.Printf("DB ERRROR2 : %v\n", err)
		return err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&result.Ip, &result.Time, &result.Policy)
		if err != nil {
			log.Printf("DB ERRROR3 : %v\n", err)
			return err
			// return errors.New("DB ERROR3")
		}
		ips = append(ips, models.IP{
			Ip:     result.Ip,
			Time:   result.Time,
			Policy: result.Policy,
		})
		fmt.Println(ips)
	}

	return c.JSON(http.StatusOK, ips)
}

func whereTime(result models.LogResult) string {
	str := ""

	if !result.StartDate.IsZero() && !result.EndDate.IsZero() { // 시작기간, 끝기간 둘 다 있을 때
		str += fmt.Sprintf("time between to_timestamp('%v', 'YYYY-MM-DD HH24:MI:SS') and to_timestamp('%v', 'YYYY-MM-DD HH24:MI:SS')", result.StartDate, result.EndDate)
	}

	return str
}
