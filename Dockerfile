# ==============================================================================
# Root Dockerfile for Render Default Web Service Settings
# Builds the Spring Boot 3 backend located in ./backend
# ==============================================================================

# Stage 1: Build the executable JAR using Maven
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace/app

# Pre-fetch dependencies for efficient layer caching
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and package application
COPY backend/src src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight, secure JRE runtime container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as non-root user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy executable jar from builder stage
COPY --from=builder /workspace/app/target/*.jar app.jar

# Render dynamically sets PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx300m", "-Xms128m", "-XX:+UseSerialGC", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
