import de.undercouch.gradle.tasks.download.Download

plugins {
  base
  val kotlinVersion = "2.1.20"
  id("org.springframework.boot") version "3.5.3"
  id("io.spring.dependency-management") version "1.1.7"
  id("org.flywaydb.flyway") version "11.0.0"
  id("de.undercouch.download") version "5.6.0"
  id("org.sonarqube") version "6.1.0.5360"
  kotlin("jvm") version kotlinVersion
  kotlin("plugin.spring") version kotlinVersion
  kotlin("plugin.jpa") version kotlinVersion
  kotlin("plugin.allopen") version kotlinVersion
  jacoco
}

group = "com.sos"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21

repositories {
  mavenCentral()
}

dependencies {
  val jwtVersion = "0.12.6"
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
  implementation("org.flywaydb:flyway-core")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib")
  implementation("org.springframework.boot:spring-boot-starter-aop")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-mail")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-websocket")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("io.github.resilience4j:resilience4j-spring-boot3:2.3.0")
  //implementation("com.github.loki4j:loki-logback-appender:1.5.2")
  implementation("com.google.guava:guava:32.0.1-android")
  implementation("net.sargue:mailgun:2.0.0")
  implementation("io.jsonwebtoken:jjwt-api:$jwtVersion")
  implementation("io.jsonwebtoken:jjwt-impl:$jwtVersion")
  implementation("io.jsonwebtoken:jjwt-jackson:$jwtVersion")
  implementation("org.glassfish.jersey.inject:jersey-hk2")
  runtimeOnly("com.h2database:h2")
  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("com.newrelic.agent.java:newrelic-agent:8.19.0")
  runtimeOnly("io.micrometer:micrometer-registry-prometheus")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.mockk:mockk:1.13.17")
  testImplementation("org.springframework.security:spring-security-test")
  testImplementation("io.micrometer:micrometer-observation-test")
}

allOpen {
  annotation("jakarta.persistence.Entity")
  annotation("jakarta.persistence.Embeddable")
  annotation("jakarta.persistence.MappedSuperclass")
}

kotlin {
  compilerOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    version = "2.1"
  }
}

flyway {
  driver = "org.postgresql.Driver"
  url = System.getenv("JDBC_DATABASE_URL")
  user = System.getenv("JDBC_DATABASE_USERNAME")
  password = System.getenv("JDBC_DATABASE_PASSWORD")
  baselineOnMigrate = true
  locations = arrayOf("filesystem:src/main/resources/db/migration")
}

sonar {
  properties {
    property("sonar.projectKey", "10Pines_smart-open-space_bc3c48a8-fa5d-4258-9950-a6c5a57efd77")
    property("sonar.projectName", "smart-open-space")
    property("sonar.host.url", "https://sonar.10pines.com")
  }
}

// Require for flyway plugin v10 compatibility with postgresql
buildscript {
  dependencies {
    classpath("org.postgresql:postgresql:42.7.4")
    classpath("org.flywaydb:flyway-database-postgresql:10.4.1")
  }
}

tasks.test {
  useJUnitPlatform()
  mustRunAfter("unzipAndSetUpNewrelic")
}

tasks.compileTestKotlin {
  mustRunAfter("unzipAndSetUpNewrelic")
}

tasks.processTestResources {
  mustRunAfter("unzipAndSetUpNewrelic")
}

tasks.clean {
  delete("newrelic")
}

tasks.build {
  finalizedBy("stage")
}

tasks.jacocoTestReport {
  reports {
    xml.required.value(true)
    html.required.value(false)
  }
  mustRunAfter("test")
}

// This make to not add version in jar and fat-jar file name
tasks.jar {
  archiveBaseName=project.name
  project.version=""
}

// New relic instrumentation
tasks.register<Download>("downloadNewrelic") {
  mkdir("newrelic")
  src("https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip")
  dest(file("newrelic"))
}

tasks.register<Copy>("unzipAndSetUpNewrelic") {
  doNotTrackState("disable unzip check")
  dependsOn(
    "downloadNewrelic", "jar", "bootJar",
    "resolveMainClassName", "compileKotlin", "processResources"
  )
  from(zipTree(file("newrelic/newrelic-java.zip")))
  into(rootDir)
  doLast {
    delete("newrelic/newrelic-java.zip")
    delete("newrelic/newrelic.yml")
    copy {
      from("config/newrelic.yml")
      into("newrelic")
    }
  }
}

// Heroku post-build tasks executions
tasks.register<Copy>("stage") {
  doNotTrackState("disable unzip check")
  dependsOn("unzipAndSetUpNewrelic")
}
