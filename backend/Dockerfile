FROM python:3.11.6-slim

# https://docs.python.org/3/using/cmdline.html#envvar
# https://pip.pypa.io/en/stable/user_guide/#environment-variables
# https://python-poetry.org/docs/configuration/
ENV PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VERSION=1.3.1 \
    POETRY_VIRTUALENVS_CREATE=0

RUN apt-get update && apt-get install -y curl git python3-pip python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0 --fix-missing

WORKDIR /code

# Install Python dependencies.
COPY requirements.txt .


RUN pip install -r requirements.txt

COPY . .

RUN useradd -m drf_ws_chat_user && chown -R drf_ws_chat_user /code

USER drf_ws_chat_user

EXPOSE 8000
