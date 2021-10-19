package models

import "time"

type LogResult struct {
	Id        int
	Ip        string
	StartDate time.Time
	EndDate   time.Time
	Time      time.Time
	Policy    string
}

type IP struct {
	Id     int
	Ip     string
	Time   time.Time
	Policy string
}
