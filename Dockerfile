# ==============================================================================
# Unified Full-Stack Multi-Stage Dockerfile for Render
# Builds React Frontend + Spring Boot 3 Backend into a single deployable JAR
# Opening "/" directly serves the React Login Page
# ==============================================================================

# Stage 1: Build React 19 + Vite Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
# Use relative /api/v1 path so frontend calls the same Render domain
RUN printf "VITE_API_BASE_URL=/api/v1\n" > .env && npm run build

# Stage 2: Build Spring Boot 3 Backend with bundled Frontend static assets
FROM maven:3.9.9-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /workspace/app

COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

COPY backend/src src
# Copy built React app into Spring Boot's static resources folder
COPY --from=frontend-builder /app/frontend/dist src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Lightweight, secure JRE runtime container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-builder /workspace/app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx300m", "-Xms128m", "-XX:+UseSerialGC", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
