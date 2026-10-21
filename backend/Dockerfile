# Multi-stage Docker build pour Spring Boot 3 (Java 17)
# Étape 1 : Compilation avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Téléchargement des dépendances en cache
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image d'exécution légère
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Configuration de l'environnement
ENV PORT=8080
EXPOSE 8080

# Démarrage optimisé pour conteneur cloud
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
