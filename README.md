# Toystore E-Commerce DevOps Project

## Overview

Toystore is a production-grade e-commerce platform demonstrating end-to-end DevOps practices. This project showcases containerization, infrastructure automation, continuous integration/deployment, and Kubernetes orchestration.

## Tech Stack

**Frontend**
- React 18 with Vite
- Nginx (containerized)
- Docker multi-stage builds

**Backend**
- Node.js 20
- Express.js API
- JWT authentication with bcrypt

**Database**
- PostgreSQL 15
- Persistent volume in Kubernetes

**DevOps & Infrastructure**
- Docker & Docker Compose
- Kubernetes (EKS / Minikube)
- Terraform (infrastructure as code)
- GitHub Actions (CI/CD)
- Docker Hub (container registry)
- Trivy (vulnerability scanning)
- Gitleaks (secret scanning)

**Cloud**
- AWS (eu-west-3)
- EKS, VPC, EC2, CloudWatch

## Architecture

```
GitHub Push
    ↓
GitHub Actions CI/CD Pipeline
├─ Test (Jest, Vitest)
├─ Security Scan (Trivy, Gitleaks)
├─ Build Docker Images
├─ Push to Docker Hub
└─ Deploy to Kubernetes
    ↓
Kubernetes Cluster
├─ Frontend Pod (3 replicas)
├─ Backend Pod (2 replicas)
└─ PostgreSQL Pod (1 replica)
```

## Features

✅ **High Availability** - Multi-pod deployments with auto-healing  
✅ **Security** - Image scanning, secret detection, least-privilege access  
✅ **Scalability** - Horizontal pod replication, stateless design  
✅ **Automation** - Full CI/CD pipeline with GitHub Actions  
✅ **Infrastructure as Code** - Terraform for reproducible deployments  
✅ **Observability** - Kubernetes logs and CloudWatch integration  

## CI/CD Pipeline

The automated deployment pipeline has 5 stages:

### 1. Test
- Runs Jest tests (backend)
- Runs Vitest tests (frontend)
- Fails if tests don't pass

### 2. Security Scan
- Trivy filesystem scan for vulnerabilities
- Gitleaks scan for hardcoded secrets
- Blocks deployment if issues found

### 3. Build & Push
- Builds Docker images for frontend and backend
- Pushes images to Docker Hub with `latest` tag
- Uses BuildKit cache for faster builds

### 4. Image Scan
- Trivy scans built images for CVEs
- Reports critical and high-severity issues

### 5. Deploy
- Updates kubeconfig for EKS cluster
- Applies Kubernetes manifests
- Restarts pods to pull new images

## Deployment Flow

```
1. Developer pushes code to main branch
                ↓
2. GitHub Actions triggered automatically
                ↓
3. Test → Security Scan → Build → Push → Deploy
                ↓
4. Kubernetes pulls images and restarts pods
                ↓
5. Services route traffic to new replicas
                ↓
6. App live on production ✓
```

## Local Development

### Start all services with Docker Compose
```bash
docker-compose up -d
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Database: localhost:5432

### Run tests
```bash
# Frontend
cd ecommerce-frontend && npm test

# Backend
cd ecommerce-backend && npm test
```

## Kubernetes Deployment

### Local (Minikube)
```bash
# Start minikube
minikube start

# Deploy
kubectl apply -f k8s-prod/postgres.yaml
kubectl apply -f k8s-prod/ecommerce-backend.yaml
kubectl apply -f k8s-prod/ecommerce-frontend.yaml
kubectl apply -f k8s-prod/ingress.yaml

# Check status
kubectl get pods -n prod
```

### Cloud (AWS EKS)
```bash
# Initialize Terraform
cd terraform
terraform init

# Plan infrastructure
terraform plan

# Deploy
terraform apply

# Configure kubectl
aws eks update-kubeconfig --name ecommerce-cluster --region eu-west-3

# Deploy apps
kubectl apply -f k8s-prod/
```

## Project Structure

```
Toy store/
├── ecommerce-frontend/          # React app with Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   └── package.json
├── ecommerce-backend/           # Node.js API
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── k8s-prod/                    # Kubernetes manifests
│   ├── postgres.yaml
│   ├── ecommerce-backend.yaml
│   ├── ecommerce-frontend.yaml
│   └── ingress.yaml
├── terraform/                   # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── terraform.tfvars
│   └── modules/
│       ├── vpc/
│       ├── iam/
│       └── eks/
├── .github/workflows/           # CI/CD pipeline
│   └── toystore-docker.yml
└── docker-compose.yml
```

## Key Learnings

This project demonstrates:

- **Containerization** with Docker multi-stage builds
- **Orchestration** with Kubernetes (services, deployments, ingress)
- **Infrastructure as Code** with Terraform modules
- **CI/CD Automation** with GitHub Actions
- **Security** through image scanning and secret detection
- **Scalability** with horizontal pod replication
- **Reliability** with self-healing and health checks

## Database Schema

**Users Table**
- id (primary key)
- email (unique)
- password_hash
- created_at

**Products Table**
- id (primary key)
- name
- price
- created_at

**Orders Table**
- id (primary key)
- user_id (foreign key)
- total
- created_at

**Order Items Table**
- id (primary key)
- order_id (foreign key)
- product_id (foreign key)
- quantity
- price_at_purchase

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - List all products

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user's order history (requires auth)

## Future Enhancements

- **Monitoring** - Prometheus + Grafana for metrics
- **RDS** - Replace PostgreSQL pod with AWS RDS
- **Auto-scaling** - HPA based on CPU/memory
- **GitOps** - ArgoCD for declarative deployments
- **Backup** - Velero for disaster recovery
- **Multi-region** - Deploy to multiple AWS regions

## Getting Started

1. Clone this repo
2. Install Docker and Kubernetes tools
3. Run `docker-compose up` locally
4. Or deploy to Kubernetes with manifests in `k8s-prod/`
5. Or use Terraform to provision AWS infrastructure

## Author

DevOps Engineer | Cloud Infrastructure | Kubernetes | Terraform | CI/CD

---

This project is a complete demonstration of modern DevOps practices suitable for production deployment.
