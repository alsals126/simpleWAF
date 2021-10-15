package log

import (
	"fmt"
	"log"
	"time"

	"simpleWAF/middleware"

	echo "github.com/labstack/echo"
)

type LogResult struct {
	Id        int
	Ip        string
	StartDate time.Time
	EndDate   time.Time
	Time      time.Time
	Policy    string
}

func Log(c echo.Context) error {
	var result LogResult
	var err error
	db := middleware.DbConnection()

	// param인자: optional (ip, time)
	qParams := c.QueryParams()
	if val, ok := qParams["ip"]; ok {
		result.Ip = val[0]
	}
	if val, ok := qParams["startDate"]; ok {
		result.StartDate, err = time.Parse("0001-01-01 00:00:00 +0000 UTC", val[0])
		if err != nil {
			log.Printf("DB ERRROR1 : %v\n", err)
			return err
		}
	}
	if val, ok := qParams["endDate"]; ok {
		result.EndDate, err = time.Parse("0001-01-01 00:00:00 +0000 UTC", val[0])
		if err != nil {
			log.Printf("DB ERRROR1 : %v\n", err)
			return err
		}
	}

	dbWhere := ""
	if result.Ip != "" {
		dbWhere += "WHERE ip LIKE '" + result.Ip + "%'"

		if whereTime(result) != "" {
			dbWhere += "AND" + whereTime(result)
		}
	} else {
		dbWhere += "WHERE" + whereTime(result)
	}

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
	}

	fmt.Println(result)

	return nil
}

func whereTime(result LogResult) string {
	str := ""

	if !result.StartDate.IsZero() && !result.EndDate.IsZero() { // 시작기간, 끝기간 둘 다 있을 때
		str += fmt.Sprintf("%v <= time <= %v", result.StartDate, result.EndDate)
	} else if !result.StartDate.IsZero() { // 시작기간만 있을 때
		str += fmt.Sprintf("%v <= time", result.StartDate)
	} else if !result.EndDate.IsZero() { // 끝기간만 있을 때
		str += fmt.Sprintf("time <= %v", result.EndDate)
	}

	return str
}
