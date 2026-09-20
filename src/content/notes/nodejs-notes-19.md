---
title: "Nginx"
part: "Node.js Notes"
track: "nodejs"
kind: "notes"
updated: "2026-09-02"
source: "Nodejs.docx"
draft: false
order: 19
description: "Node.js — Nginx."
---
It is a powerful web server and uses non-threaded, event driven architecture. It can also do other important things such as load balancing, and http caching and also can be used as a reverse proxy.

### Forward Proxy

![](/notes-img/nodejs-notes/img-027.webp)

A proxy server, sometimes referred to as a **forward proxy,** is a server that routes traffic between client(s) and another system, usually external to the network. By doing so, it can regulate traffic according to preset policies, convert and mask client IP addresses, enforce security protocols, and block unknown traffic e.g. VPN

-   Can Handle 10,000 Concurrent
-   Requests
-   Cache HTTP Requests
-   Act as Reverse Proxy N
-   Act as Load Balancer
-   Act as an API Gateway
-   Serve and Cache Static files like images,
-   videos, etc.
-   Handle SSL Certificates

### Reverse proxy

A reverse proxy server is a type of proxy server that typically sits behind the firewall in a private network and directs client requests to the appropriate backend server. A reverse proxy provides an additional level of abstraction and control to ensure the smooth flow of network traffic between clients and servers.

### ![](/notes-img/nodejs-notes/img-028.webp)

## Install and Setup Nginx

We are using docker to use ubuntu

-   Docker run -it -p 8080:80 ubuntu

Once you are in root, update the system

-   apt-get update
-   apt-get install nginx
    Verify nginx -v
Since we have used 8080 as a port. So url be [http://localhost:8080/](http://localhost:8080/)

cd /etc/nginx

![](/notes-img/nodejs-notes/img-029.webp)
