package com.expensetracker.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Smart DataSource Configuration:
 * - If user provides an external/cloud MySQL connection URL (e.g. TiDB, Aiven, PlanetScale, AWS), connects to it.
 * - If running locally with MySQL on localhost:3306, connects to MySQL.
 * - If MySQL server is offline / unreachable, gracefully falls back to an embedded
 *   in-memory H2 database (with MySQL compatibility mode) so the application
 *   runs immediately without crashing on startup.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/expensedb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:root}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        boolean isLocalhost = mysqlUrl.contains("localhost") || mysqlUrl.contains("127.0.0.1");

        // If pointing to localhost, verify port 3306 is open before connecting
        if (isLocalhost) {
            if (isPortReachable("localhost", 3306)) {
                log.info("=================================================================");
                log.info("✅ MySQL server detected on localhost:3306. Connecting to MySQL: expensedb");
                log.info("=================================================================");
                return createMySQLDataSource();
            } else {
                log.warn("=================================================================");
                log.warn("⚠️  Local MySQL server is NOT running on localhost:3306.");
                log.warn("⚠️  Auto-activating in-memory database (expensedb) so the app runs smoothly!");
                log.warn("=================================================================");
                return createH2DataSource();
            }
        } else {
            // Remote / cloud database provided (e.g. on Render / Cloud)
            try {
                log.info("=================================================================");
                log.info("☁️  Remote/Cloud Database configured. Connecting to: {}", maskJdbcUrl(mysqlUrl));
                log.info("=================================================================");
                return createMySQLDataSource();
            } catch (Exception e) {
                log.error("Failed to connect to remote database: {}. Falling back to H2.", e.getMessage());
                return createH2DataSource();
            }
        }
    }

    private DataSource createMySQLDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(mysqlUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setPoolName("ExpenseTrackerMySQLPool");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(15000);
        return new HikariDataSource(config);
    }

    private DataSource createH2DataSource() {
        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:mem:expensedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
        h2Config.setUsername("sa");
        h2Config.setPassword("password");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setPoolName("ExpenseTrackerH2FallbackPool");
        h2Config.setMaximumPoolSize(10);
        h2Config.setMinimumIdle(2);
        return new HikariDataSource(h2Config);
    }

    private boolean isPortReachable(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 800);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String maskJdbcUrl(String url) {
        if (url == null) return "";
        return url.replaceAll("(?i)(password=)[^;&]+", "$1*****");
    }
}
