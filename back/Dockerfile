FROM eclipse-temurin:21-jre-ubi9-minimal

COPY newrelic newrelic
COPY build/libs/smart-open-space.jar smart-open-space.jar

# app required envs
ENV SPRING_PROFILE=$SPRING_PROFILE
ENV APP_PORT=$APP_PORT

# new relic envs
ENV NEW_RELIC_LICENSE_KEY=$NEW_RELIC_LICENSE_KEY
ENV NEW_RELIC_LOG=$NEW_RELIC_LOG


CMD ["java","-javaagent:newrelic/newrelic.jar","-jar","/smart-open-space.jar","--server.port=${APP_PORT}","--spring.profiles.active=${SPRING_PROFILE}"]
