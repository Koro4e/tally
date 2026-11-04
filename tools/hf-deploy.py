# -*- coding: utf-8 -*-
"""Деплой TALLY на Hugging Face Space (sdk: docker).
Собирает staging-папку (README+Dockerfile+server+dist), создаёт Space,
заливает файлы, прописывает секреты. Запуск:
  D:/AI-Workspace/tts-local/venv/Scripts/python.exe tools/hf-deploy.py
"""
import io
import os
import shutil

from huggingface_hub import HfApi

# токены берутся из окружения/переменных Vercel — в коде их нет
TOKEN = os.environ.get("HF_TOKEN") or ""
USER = "Koro4eQCSCSC"
REPO = f"{USER}/tally"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGE = os.path.join(ROOT, "hf-space")

api = HfApi(token=TOKEN)
print("кто я:", api.whoami()["name"])

# 1. staging
if os.path.exists(STAGE):
    shutil.rmtree(STAGE)
os.makedirs(STAGE)

io.open(os.path.join(STAGE, "README.md"), "w", encoding="utf-8").write(
    """---
title: TALLY
emoji: "\U0001F989"
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

TALLY — экзаменационный тренажёр (Studienkolleg Kiel, 09.01.2027).
Один Node-сервер: статика dist/ + /api (Groq/IFM задачи, объяснения, OCR).
"""
)
io.open(os.path.join(STAGE, "Dockerfile"), "w", encoding="utf-8").write(
    """FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY dist ./dist
ENV HOST=0.0.0.0
ENV PORT=7860
EXPOSE 7860
CMD ["npm", "run", "server"]
"""
)
shutil.copy(os.path.join(ROOT, "package.json"), STAGE)
shutil.copy(os.path.join(ROOT, "package-lock.json"), STAGE)
shutil.copytree(os.path.join(ROOT, "server"), os.path.join(STAGE, "server"))
shutil.copytree(os.path.join(ROOT, "dist"), os.path.join(STAGE, "dist"))
print("staging собран:", sum(len(f) for _, _, f in os.walk(STAGE)), "файлов")

# 2. Space (docker sdk)
api.create_repo(repo_id=REPO, repo_type="space", space_sdk="docker", private=False, exist_ok=True)
print("space:", REPO)

# 3. заливка
api.upload_folder(folder_path=STAGE, repo_id=REPO, repo_type="space", commit_message="deploy")
print("файлы залиты")

# 4. секреты из .env.local
secrets = {}
for line in io.open(os.path.join(ROOT, ".env.local"), encoding="utf-8"):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        if k in ("GROQ_KEYS", "IFM_API_KEY", "KIOSAPI_KEY"):
            secrets[k] = v.strip()
for k, v in secrets.items():
    api.add_space_secret(repo_id=REPO, key=k, value=v)
    print("secret:", k, "ок")
print("DONE — сборка Space стартует, URL: https://huggingface.co/spaces/" + REPO)
