# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Railway will assign PORT environment variable)
EXPOSE ${PORT:-8081}

# Run the jar file
CMD ["java", "-Dserver.port=${PORT:-8081}", "-jar", "target/personalfinancetracker-0.0.1-SNAPSHOT.jar"]