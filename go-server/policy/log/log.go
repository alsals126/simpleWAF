package log

import (
	"log"
	"time"

	"simpleWAF/middleware"
	"simpleWAF/policy/policydb"

	echo "github.com/labstack/echo"
)

type LogResult struct {
	Id        int
	Ip        string
	StartTime time.Time
	EndTime   time.Time
	Policy    string
}

func Log(c echo.Context) error {
	// var id int
	var result policydb.IP
	//var ip string
	// var startTime time.Time
	// var endTime time.Time
	// var policy string
	//var err error
	db := middleware.DbConnection()

	// param인자: optional (ip, time)
	qParams := c.QueryParams()
	if val, ok := qParams["ip"]; ok {
		ip.Ip = val[0]
	}
	// if val, ok := qParams["startTime"]; ok {
	// 	startTime, err = time.Parse("0001-01-01 00:00:00 +0000 UTC", val[0])
	// 	if err != nil {
	// 		log.Printf("DB ERRROR1 : %v\n", err)
	// 		return err
	// 	}
	// }
	// if val, ok := qParams["endTime"]; ok {
	// 	endTime, err = time.Parse("0001-01-01 00:00:00 +0000 UTC", val[0])
	// 	if err != nil {
	// 		log.Printf("DB ERRROR1 : %v\n", err)
	// 		return err
	// 	}
	// }
	if val, ok := qParams["policy"]; ok {
		ip.Policy = val[0]
	}

	// dbWhere := ""
	// if ip != "" {
	// 	if ip == "" {
	// 		dbWhere = "WHERE date > "
	// 	}
	// } else {

	// }

	if ip != "" {
		// query := "SELECT id, ip, time FROM ipproxy WHERE ip LIKE '" + ip + "%'"
		// rows, err := db.Query(query)
		rows, err := db.Query("SELECT ip, policy FROM ipproxy WHERE ip LIKE $1", ip+"%")
		if err != nil {
			log.Printf("DB ERRROR2 : %v\n", err)
			return err
		}
		defer rows.Close()

		for rows.Next() {
			err := rows.Scan(&ip.Ip, &ip.Policy)
			if err != nil {
				// 여기서 오류남
				log.Printf("DB ERRROR3 : %v\n", err)
				return err
				// return errors.New("DB ERROR3")
			}
		}
	}
	return nil

}

func where() {

}
