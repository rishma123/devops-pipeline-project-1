# 🚀 DevOps CI/CD Pipeline Project

A simple end-to-end CI/CD pipeline using **Docker, Docker Hub, GitHub Actions, AWS EC2, Nginx, and Docker Compose**.  
Every push to `main` automatically builds a Docker image, pushes it to Docker Hub, and redeploys the app on EC2.

---

## ⭐ Features
- Dockerized Node.js application  
- Nginx reverse proxy  
- GitHub Actions CI (build + push to Docker Hub)  
- GitHub Actions CD (SSH → EC2 → docker-compose)  
- Fully automated deployment  
- Live on EC2 via port 80  

---

## 🏗️ Architecture
GitHub → GitHub Actions → Docker Hub → GitHub Actions (CD) → EC2 → Nginx → Browser


---

## 🧱 Tech Stack
- Docker  
- Docker Hub  
- GitHub Actions  
- AWS EC2  
- Docker Compose  
- Nginx  
- Node.js  

---

## 📁 Project Structure
app/
nginx/
Dockerfile
docker-compose.yml
.github/workflows/


---

## 🐳 Docker Commands

**Build:**
docker build -t rishmamn/devops-pipeline-demo:latest ./app


**Run locally:**


docker-compose up -d


---

## 🔄 CI: GitHub Actions (docker-publish.yml)

```yaml
name: Build & Push Docker Image

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - run: docker build -t rishmamn/devops-pipeline-demo:latest ./app
      - run: docker push rishmamn/devops-pipeline-demo:latest

🔁 CD: GitHub Actions (deploy.yml)
name: Deploy to EC2

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup SSH key
        run: |
          echo "${{ secrets.EC2_KEY }}" > private_key.pem
          chmod 600 private_key.pem

      - name: Copy project files
        run: |
          ssh -o StrictHostKeyChecking=no -i private_key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} "sudo mkdir -p /var/www/devops-project && sudo chown -R ubuntu:ubuntu /var/www/devops-project"
          scp -o StrictHostKeyChecking=no -i private_key.pem -r * ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }}:/var/www/devops-project/

      - name: Deploy
        run: |
          ssh -o StrictHostKeyChecking=no -i private_key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd /var/www/devops-project
            sudo docker pull rishmamn/devops-pipeline-demo:latest
            sudo docker-compose down || true
            sudo docker-compose up -d
          EOF

🌍 Live Site
http://<ec2-public-ip>


Expected output:

Hello Rishma! Your first Docker image works!
