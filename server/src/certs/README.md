## Certificaties
run these commands

- Option 1
use openssl
```
openssl genpkey -algorithm RSA -out key.pem
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

- Option 2
use mkcert
```
mkcert -install
mkcert localhost
```
