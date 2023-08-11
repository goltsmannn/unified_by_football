#! /usr/bin/bash
echo "Activating venv..."
cd venv/
cd Scripts/
source activate
echo "Venv activated..."
cd ..
cd ..
cd IGW/
echo "Pulling changes from Github repo..."
git remote show origin
git pull
echo "y/n run the server"
read flag

if [ $flag == "y" ]; then
	python manage.py runserver
else
	echo "Configuration completed"
fi