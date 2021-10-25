package models

import "time"

type LogResult struct {
	Id        int
	Key       int
	Ip        string
	StartDate time.Time
	EndDate   time.Time
	Date      time.Time
	Policy    string
}

type IPblock struct {
	Id     int
	Ip     string
	Policy string
}

type UserCustom struct {
	Id     int
	Field  string
	Rule   string
	Policy string
}
