## Требования для запуска

Требования для запуска проекта:

- PHP>=8.1
- PHP модули PDO, mbstring, curl, simplexml
- composer
- NodeJS>=14
- npm
- MySQL

## Подготовка проекта к запуску

После клонирования проекта удостоверьтесь, что ваша систему кдовлетворяет требованиям выше.
Первым шагом необходимо установить требуемые зависимости:

```bash
# установка зависимостей php
composer install

# установка зависимостей nodejs
npm install
```

Необходимо скопировать файл со списком переменных окружения `.env.example` в `.env`

```bash
cp .env.example .env
```

Данный файл содержит локальные настройки, многие из которых будут уникальные для каждого рабочего места.
В нем необходимо выставить настройки используемой базы данных, это можно сделать с помощью переменных `DB_***`:

```dotenv
# семейтво бд, оставляем значение mysql
DB_CONNECTION=mysql

# настройки для подключения к вашей бд
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

После установки корректных значений настройки БД можем продолжать разворачивание проекта:

```bash
# Генерация ключа шифрования, для работы с паролями и токенами доступа.
# Эту команду надо вызвать только один раз после первой установки проекта на новый сервер или рабочую станцию
./artisan key:generate

# Создание символьной ссылки из хранилища файлов в папку, доступную для веб сервера
# Эту команду надо вызвать только один раз после первой установки проекта на новый сервер или рабочую станцию
./artisan storage:link

# Приведение базы данных в актуальное состояние
# Данную команду надо вызывать каждый раз, как в папке database/migrations/ появляются новые файлы миграций
./artisan migrate

# Создание структуры рубрик
./artisan app:fill-categories

# Парсинг нескольких RSS лент для заполнения списка новостей
./artisan app:fill-articles
```

## Запуск в режиме разработки

Для запуска в режиме разработки прежде всего необходимо выставить в `.env` файле следующие параметры:

```dotenv
APP_ENV=local
APP_DEBUG=true
```

После чего произвести запуск проекта следующими командами

```bash
# в одной вкладке терминала поднимаем встроенный PHP веб сервер для
./artisan serve

# в другой вкладке - сборка фронта
npm run dev
```

Проект по умолчанию использует адреу http://localhost:8000/, просто переходим на данной ссылке в браузере.

## Запуск в режиме продакшена

Для запуска в режиме разработки прежде всего необходимо выставить в `.env` файле следующие параметры:

```dotenv
APP_ENV=production
APP_DEBUG=false
```

Для старта в режиме продакшена необходимо сначала произвести сборку фронтовых скриптов и стилей следующей командой:

```bash
npm run build
```

После чего надо запустить веб сервер. Для запуска встроенного php веб сервера можно воспользоваться командой:

```bash
./artisan serve
```

Но для полноценной работы рекомендуется использовать в роли веб сервера связку nginx+php-fpm.
Пример nginx конфига в данном случае будет такой:

```nginx
server {
    server_name _ default;
    listen      80;
    index       index.php index.html;
    root        /app/public;

    access_log  /var/log/nginx/app.access.log;
    error_log   /var/log/nginx/app.error.log;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~\.php$ {
        include fastcgi_params;

        fastcgi_index index.php;
        fastcgi_param DOCUMENT_ROOT /app/public;
        fastcgi_param SCRIPT_FILENAME /app/public$fastcgi_script_name;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;

        # если php-fpm слушает 9000 порт
        fastcgi_pass http://127.0.0.1:9000;
        
        # если php-fpm слушает сокет /run/php/php.sock
        # fastcgi_pass unix:/run/php/php.sock;
    }
}
```
