How to start the app:

1) Create empty directory. Git bash there
2) git clone https://github.com/goltsmannn/unified_by_football
3) cd unified_by_football
4) virtualenv venv (if virtualenv not installed - use any other env or pip install virtualenv)
5) source venv/Scripts/activate
6) pip install -r requirements.txt
7) check that django is installed - pip list, find it
8) cd source_code
9) python manage.py makemigrations
10) python manage.py migrate
11) python manage.py runserver
The server should start on port 8000
Now you have to open one more bash window in unified_by_football.
Set up working directory as in the first one:
1) cd frontend/front-react/
2) npm install
3) npm start
4) (optional, if you want to start apps from 8000 port together): npm run build instead of step 3. go to 127.0.0.1:8000
The app should start on port 3000