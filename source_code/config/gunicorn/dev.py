wsgi_app = "IGW.wsgi:application"

loglevel = "debug"

workers = 2

accesslog = errorlog = "/var/log/gunicorn/dev.log"
capture_output = True
pidfile = "/var/run/gunicorn/dev.pid"

bind = "0.0.0.0:8000"

reload = True


daemon = True

