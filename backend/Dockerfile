FROM python:3.9-slim

WORKDIR /app

COPY requirements/dev.txt requirements/dev.txt
COPY requirements/base.txt requirements/base.txt

RUN pip install -r requirements/dev.txt

COPY src /app/src

CMD ["python", "/app/src/app.py"] 