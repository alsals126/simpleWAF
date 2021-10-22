// https://www.integralist.co.uk/posts/golang-reverse-proxy/
// ↑ 공부한 사이트
package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"reverseProxy/waf"
)

func main() {
	origin, _ := url.Parse("http://www.example.com/") //임시 사이트

	director := func(req *http.Request) {
		req.Header.Add("X-Forwarded-Host", req.Host)
		req.Header.Add("X-Origin-Host", origin.Host)
		req.URL.Scheme = "http"
		req.URL.Host = origin.Host
	}

	wafinfo := &waf.Waf{
		Proxy: &httputil.ReverseProxy{Director: director},
	}

	http.HandleFunc("/", wafinfo.Handler)

	log.Fatal(http.ListenAndServe(":80", nil))
}
