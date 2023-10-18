How to start the app:

1) Create empty directory. Git bash there
2) git clone https://github.com/goltsmannn/unified_by_football
3) cd unified_by_football
4) virtualenv venv (if virtualenv not installed - use any other env or pip install virtualenv)
5) source venv/Scripts/activate
6) pip install -r requirements.txt
7) git checkout changing_user_model_issues

Now you have to open one more bash window in unified_by_football.
Set up working directory as .../unified_by_football/source_code in both:
In the first one:
1) python manage.py runserver
In the second one:
1) cd frontend/front-react/
2) npm init
3) npm start