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
	origin, err := url.Parse("http://www.example.com/") //임시 사이트
	if err != nil {
		log.Printf("DB ERRROR(Parse): %v\n", err)
	}

	// Director must be a function which modifies the request into a new request to be sent using Transport(The transport used to perform proxy requests.).
	// Its response is then copied back to the original client unmodified.
	// Director must not access the provided Request after returning.
	// 디렉터는 Transport를 사용하여 보낼 새 요청에 대한 요청을 수정하는 함수여야 한다.
	// C → Proxy → origin 할때, proxy가 origin에 요청을 보낼 때 설정하는 함수
	director := func(req *http.Request) {
		req.Header.Add("X-Forwarded-Host", req.Host) //요청한 클라이언트 호스트 알아내기
		req.Header.Add("X-Origin-Host", origin.Host) //파싱한 웹사이트의 호스트명(포트포함. 단, SplitHostPort를 사용해서 추출해야함)

		// 클라이언트의 목적지 설정
		req.URL.Scheme = "http" //사용할 프로토콜
		req.URL.Host = origin.Host
	}

	wafinfo := &waf.Waf{
		Proxy: &httputil.ReverseProxy{Director: director},
	}

	http.HandleFunc("/", wafinfo.Handler)

	log.Fatal(http.ListenAndServe(":80", nil))
}
