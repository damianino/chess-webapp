# Chess with chess engine on the server

## Running for the first time?

Deploy in three simple commands!

Pyhton(./backend): 
    pip install -r requirements.txt

Node(./frontend):
    npm install

Redis(./):
    docker build -t chess-redis .

## To run the app:

Run in three simple commands!

Pyhton(./backend): 
    python manage.py runserver

Node(./frontend):
    npm run

Redis(./):
    docker run -dp 6379:6379 chess-redis

