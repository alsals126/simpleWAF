// ip차단정책 가능
package waf

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

type Waf struct {
	Proxy  *httputil.ReverseProxy
	db     *sql.DB
	ip     string
	policy []string
}
type Rule struct {
	id   int
	rule string
}

// handler
func (waf *Waf) Handler(w http.ResponseWriter, r *http.Request) {
	waf.policy = make([]string, 0) //policy 초기화

	waf.dbConnection()
	waf.ip = strings.Split(getIP(r), ":")[0]

	if waf.whatPolicy(r) {
		fmt.Fprintln(w, "<h1>BLOCK</h1>")
	} else {
		waf.Proxy.ServeHTTP(w, r)
	}
	waf.logInsert()
}

func (waf *Waf) dbConnection() {
	var dbinfo = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		"jeongmin", "1234asdf#$", "jeongmindb")

	var err error
	waf.db, err = sql.Open("postgres", dbinfo)
	if err != nil {
		log.Printf("Could not connect to Database : %v\n", err)
	}
}

// ip주소 구하기
func getIP(r *http.Request) string {
	IPAddress := r.Header.Get("X-Real-Ip")
	if IPAddress == "" {
		IPAddress = r.Header.Get("X-Forwarded-For")
	}
	if IPAddress == "" {
		IPAddress = r.RemoteAddr
	}
	return IPAddress
}

func (waf *Waf) whatPolicy(r *http.Request) bool {
	// 사용자정의탐지 정책
	var tem = [...]string{
		r.Header.Get("User-Agent"),
		r.Header.Get("Cookie"),
		r.Host,
		r.RequestURI,
		r.Method,
	}
	for i, value := range tem {
		waf.policy = append(waf.policy, waf.getUserCustom(i, value)...)
	}

	//ip차단 정책
	var p string
	err := waf.db.QueryRow("SELECT policy FROM proxy_ipblock WHERE ip=$1", waf.ip).Scan(&p)
	if err != nil {
		log.Printf("DB ERRROR(IP BLOCK): %v\n", err)
		return false
	} else {
		waf.policy = append(waf.policy, p)
		return true
	}
}

// user custom
func (waf Waf) getUserCustom(i int, usercustom string) []string {
	var field = [...]string{"User-Agent", "Cookie", "Host", "URI", "Method"}

	// 규칙 구하기
	var rule Rule
	var rules []Rule

	rows, err := waf.db.Query("SELECT id, rule FROM proxy_usercustom WHERE field=$1", field)
	if err != nil {
		log.Printf("DB ERRROR1(UserCustom) : %v\n", err)
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&rule.id, &rule.rule)
		if err != nil {
			log.Printf("DB ERRROR2(UserCustom) : %v\n", err)
		}
		rules = append(rules, rule)
	}

	// 정책 구하기
	var policy []string
	for _, value := range rules {
		if strings.Contains(usercustom, value.rule) {
			rows, err := waf.db.Query("SELECT policy FROM proxy_usercustom WHERE id=$1", value.id)
			if err != nil {
				log.Printf("DB ERRROR3(UserCustom) : %v\n", err)
			}
			defer rows.Close()

			for rows.Next() {
				var p string
				err := rows.Scan(&p)
				if err != nil {
					log.Printf("DB ERRROR4(UserCustom) : %v\n", err)
				}
				policy = append(policy, p)
			}
		}
	}
	return policy
}

// 로그 insert
func (waf Waf) logInsert() {
	for _, value := range waf.policy {
		_, err := waf.db.Exec("INSERT INTO proxy_log(ip, date, policy) VALUES($1, $2, $3)", waf.ip, time.Now(), value)
		if err != nil {
			log.Printf("DB ERRROR(INSERT): %v\n", err)
		}
	}
}
