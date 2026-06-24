# DEPLOY — Sitorai Mohi Xosa

Полный гайд: задеплоить с любого нового компа **без захода в веб-консоль DigitalOcean**.
Всё делается через `doctl` (CLI DO) + SSH + локальный `./deploy.sh`.

> **Про секреты.** В этом файле нет настоящих ключей — нельзя коммитить токены в репозиторий.
> Каждый секрет описан так: *как сгенерить* + *куда положить*. Если ключи уже есть на старом компе —
> скопируй файлы через `scp`/USB/1Password, см. §1.3.

---

## Что у нас в проде сейчас

| Что | Значение |
|---|---|
| Домен | `mohixossa.uz` (+ `www.mohixossa.uz` → редирект) |
| Fallback URL | `https://206-81-26-116.nip.io` |
| Droplet IP | `206.81.26.116` |
| Папка приложения | `/var/www/sitorai-mohi-xosa` |
| Процесс-менеджер | `pm2` (имя процесса: `sitorai`) |
| Reverse-proxy | Caddy 2 (`/etc/caddy/Caddyfile`) |
| База | PostgreSQL на самом дроплете (`localhost:5432`) |
| Репо | `https://github.com/Jamshidmirzo/sitorai-mohi-xosa.git` |
| Деплой-скрипт | `./deploy.sh` (см. корень репо) |

---

## §1. Новый комп → существующий дроплет (типовой случай)

Если сервер уже работает и нужно просто иметь возможность деплоить с этой машины.

### 1.1. Поставить инструменты

```bash
# macOS
brew install git node@20 doctl

# Ubuntu / Debian
sudo apt update && sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
# doctl:
curl -sL https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz | tar -xzv && sudo mv doctl /usr/local/bin
```

Проверь:
```bash
node -v   # должно быть >= 20
git --version
doctl version
```

### 1.2. Клонировать репо

```bash
mkdir -p ~/Desktop/intersoft/temp-analysis
cd ~/Desktop/intersoft/temp-analysis
git clone https://github.com/Jamshidmirzo/sitorai-mohi-xosa.git
cd sitorai-mohi-xosa
npm ci
```

### 1.3. Получить SSH-ключ для дроплета

Скрипт `deploy.sh` ходит на сервер по ключу `~/.ssh/mohi_hosa_deploy`.

**Вариант A — скопировать с другого моего компа** (если ключ уже есть):
```bash
# на СТАРОМ компе:
scp ~/.ssh/mohi_hosa_deploy ~/.ssh/mohi_hosa_deploy.pub  new-mac.local:~/.ssh/
# или через USB / 1Password vault — главное не присылай по email/telegram
```
Потом на новом компе:
```bash
chmod 600 ~/.ssh/mohi_hosa_deploy
chmod 644 ~/.ssh/mohi_hosa_deploy.pub
```

**Вариант B — сгенерить новый ключ и добавить его на дроплет** (если старого нет под рукой):
```bash
# 1. на новом компе:
ssh-keygen -t ed25519 -f ~/.ssh/mohi_hosa_deploy -C "deploy@$(hostname)" -N ""

# 2. добавить публичный ключ на сервер.
#    нужен временный доступ — либо паролем root, либо со старого компа:
cat ~/.ssh/mohi_hosa_deploy.pub | ssh root@206.81.26.116 'cat >> /root/.ssh/authorized_keys'

# 3. проверить:
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'whoami'
# → root
```

> Если ни старого ключа, ни пароля нет — единственный способ восстановить доступ без веб-консоли DO — это `doctl compute ssh-key import` + reboot через `doctl compute droplet-action` (см. §3).

### 1.4. Локальный `.env` (только для запуска dev-команд типа `prisma studio`)

```bash
cp .env.example .env
# отредактируй: DATABASE_URL может смотреть на локальный PG, или прокинь туннель:
#   ssh -i ~/.ssh/mohi_hosa_deploy -L 5432:localhost:5432 root@206.81.26.116
# тогда в .env: DATABASE_URL="postgresql://sitorai:PASSWORD@localhost:5432/sitorai_mohi_xosa"
```
Сами секреты сервера живут в `/var/www/sitorai-mohi-xosa/.env` на дроплете —
их в репо не тянем.

### 1.5. Задеплоить

```bash
./deploy.sh                # обычный деплой: push → ssh → pull → build → pm2 restart
./deploy.sh --skip-build   # если поменялся только .env на сервере
./deploy.sh --reseed       # дополнительно прогнать seed-dissertation*.ts
```

В конце скрипт сам делает smoke-test (`/ru`, `/en`, `/uz`, `/admin/login` → должны быть `200`/`302`).

**Всё. С этого момента деплой = одна команда.**

---

## §2. Daily ops без веб-консоли

Всё через SSH-туннель / `doctl`. Веб-консоль не нужна.

### 2.1. Логи приложения
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'pm2 logs sitorai --lines 200 --nostream'
```
Стримом (Ctrl-C для выхода):
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 -t 'pm2 logs sitorai'
```

### 2.2. Логи Caddy / nginx-подобные
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'journalctl -u caddy -n 200 --no-pager'
```

### 2.3. Рестарт без редеплоя
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'pm2 restart sitorai'
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'systemctl reload caddy'
```

### 2.4. Бэкап БД на свой комп
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 \
  'pg_dump -U sitorai sitorai_mohi_xosa' \
  | gzip > ~/Desktop/sitorai-backup-$(date +%F).sql.gz
```

### 2.5. Восстановить БД из бэкапа
```bash
gunzip -c ~/Desktop/sitorai-backup-2026-06-24.sql.gz \
  | ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 \
    'psql -U sitorai sitorai_mohi_xosa'
```

### 2.6. Поменять переменную окружения на сервере
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'nano /var/www/sitorai-mohi-xosa/.env'
ssh -i ~/.ssh/mohi_hosa_deploy root@206.81.26.116 'pm2 restart sitorai --update-env'
```

### 2.7. Залить загруженные файлы (`/uploads`) себе
Они НЕ в git (см. `.gitignore`), берём с сервера:
```bash
rsync -avz -e "ssh -i ~/.ssh/mohi_hosa_deploy" \
  root@206.81.26.116:/var/www/sitorai-mohi-xosa/public/uploads/ \
  ./public/uploads/
```

### 2.8. Информация про дроплет через doctl (без веб-консоли)
```bash
doctl auth init      # один раз: вставить Personal Access Token (см. §3.1)
doctl compute droplet list
doctl compute droplet get <droplet-id> --format Name,PublicIPv4,Memory,Disk,Status
doctl compute droplet-action reboot <droplet-id>          # ребут
doctl compute droplet-action power-cycle <droplet-id>     # жёсткий ребут
```

---

## §3. Если надо поднять дроплет с нуля (полное провижининг через doctl)

Делать НЕ нужно, пока текущий жив. Это disaster recovery / клон в staging.

### 3.1. Получить DigitalOcean API token
1. Зайди один раз на https://cloud.digitalocean.com/account/api/tokens (это единственное место, где DO ключ выдаёт).
2. New Token → scope `read + write` → срок 90 дней.
3. Скопируй токен.
4. Положи на свой комп:
   ```bash
   doctl auth init       # вставить токен
   doctl account get     # проверка
   ```

> Ничего другого через веб-консоль делать не придётся.

### 3.2. Залить SSH-ключ в DO
```bash
ssh-keygen -t ed25519 -f ~/.ssh/mohi_hosa_deploy -C "mohi-hosa deploy" -N ""
doctl compute ssh-key import mohi-hosa-deploy --public-key-file ~/.ssh/mohi_hosa_deploy.pub
doctl compute ssh-key list
# запомни fingerprint, понадобится ниже
```

### 3.3. Создать дроплет
```bash
SSH_FP=$(doctl compute ssh-key list --no-header --format FingerPrint | head -1)

doctl compute droplet create sitorai-mohi-xosa \
  --image ubuntu-24-04-x64 \
  --size s-2vcpu-2gb \
  --region fra1 \
  --ssh-keys "$SSH_FP" \
  --enable-monitoring \
  --enable-ipv6 \
  --wait

doctl compute droplet list   # запомни новый IP
```

### 3.4. Накатить базовый софт
```bash
NEW_IP=<ip-из-предыдущей-команды>
ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP bash <<'EOF'
set -e
apt update && apt upgrade -y
apt install -y curl git ufw postgresql postgresql-contrib

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2 tsx

# Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

# firewall
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable
EOF
```

### 3.5. Создать БД и пользователя
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP bash <<'EOF'
sudo -u postgres psql <<SQL
CREATE USER sitorai WITH PASSWORD 'CHANGE_ME_strong_random';
CREATE DATABASE sitorai_mohi_xosa OWNER sitorai;
GRANT ALL PRIVILEGES ON DATABASE sitorai_mohi_xosa TO sitorai;
SQL
EOF
```
> Пароль сгенерь: `openssl rand -base64 24`. Запиши его — он пойдёт в `.env` следующим шагом.

### 3.6. Клонировать репо на сервер
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP bash <<'EOF'
mkdir -p /var/www
cd /var/www
git clone https://github.com/Jamshidmirzo/sitorai-mohi-xosa.git
cd sitorai-mohi-xosa
npm ci
npx prisma generate
EOF
```

### 3.7. `.env` на сервере
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP bash <<EOF
cat > /var/www/sitorai-mohi-xosa/.env <<ENV
DATABASE_URL="postgresql://sitorai:PASTE_PG_PASSWORD_HERE@localhost:5432/sitorai_mohi_xosa?schema=public"
NEXTAUTH_URL="https://mohixossa.uz"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
AUTH_SECRET="\$NEXTAUTH_SECRET"
NODE_ENV="production"
ENV
EOF
```
> ВРУЧНУЮ замени `PASTE_PG_PASSWORD_HERE` на пароль из §3.5. `AUTH_SECRET` должен быть **тем же**, что `NEXTAUTH_SECRET`.

### 3.8. Первый билд + миграции + сиды
```bash
ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP bash <<'EOF'
cd /var/www/sitorai-mohi-xosa
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
for f in prisma/seed-dissertation*.ts; do npx tsx "$f"; done
NODE_OPTIONS=--max-old-space-size=2048 npm run build
pm2 start npm --name sitorai -- start
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash
EOF
```

### 3.9. Каddy
```bash
scp -i ~/.ssh/mohi_hosa_deploy \
  ./deploy/Caddyfile.production \
  root@$NEW_IP:/etc/caddy/Caddyfile

ssh -i ~/.ssh/mohi_hosa_deploy root@$NEW_IP 'systemctl reload caddy'
```

### 3.10. DNS
Если нужно сменить IP в DNS:
```bash
# через doctl (зона уже зарегана в DO):
doctl compute domain records list mohixossa.uz
doctl compute domain records update mohixossa.uz --record-id <id> --record-data $NEW_IP
```
TTL по умолчанию 1800 → подождать ~30 мин.

### 3.11. Проверить
```bash
curl -I https://mohixossa.uz/ru     # должно быть 200
curl -I https://mohixossa.uz/admin/login  # 200/302
```

---

## §4. Troubleshooting

| Симптом | Где смотреть / что делать |
|---|---|
| `Permission denied (publickey)` при `./deploy.sh` | Ключ не на дроплете → §1.3 вариант B |
| `502 Bad Gateway` от Caddy | `pm2 status` на сервере; `pm2 restart sitorai`; `pm2 logs sitorai` |
| `prisma db push` падает с auth error | Проверь `DATABASE_URL` в `/var/www/sitorai-mohi-xosa/.env` |
| Загруженные файлы исчезли после билда | Они в `/public/uploads` — НЕ в git; `rsync` бэкап (§2.7) |
| Сайт ругается на CORS / NextAuth | `NEXTAUTH_URL` должен совпадать со схемой+хостом, по которому открываешь |
| После `git push` сервер не обновился | Это нормально — деплой ручной: запусти `./deploy.sh` |
| SSL не выдаётся | `journalctl -u caddy -e` — обычно DNS не указывает на дроплет, или порт 80 закрыт |

---

## §5. Чек-лист «новый комп → первый деплой» (TL;DR)

1. `brew install git node@20 doctl` (или apt-эквивалент)
2. `git clone https://github.com/Jamshidmirzo/sitorai-mohi-xosa.git && cd sitorai-mohi-xosa && npm ci`
3. Положить `~/.ssh/mohi_hosa_deploy` (скопировать со старого компа или сгенерить + закинуть на сервер)
4. `chmod 600 ~/.ssh/mohi_hosa_deploy`
5. `./deploy.sh`

Готово.
