package com.jh.app;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@SpringBootApplication
public class KosmoReactApplication {

    public static void main(String[] args) {
        SpringApplication.run(KosmoReactApplication.class, args);
    }

    @Bean
    public CommandLineRunner schemaMigrator(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                stmt.execute("ALTER TABLE tb_user_profiles DROP COLUMN IF EXISTS file_path;");
                System.out.println(">>> SUCCESSFULLY DROPPED file_path COLUMN FROM tb_user_profiles <<<");
            } catch (Exception e) {
                System.err.println(">>> SCHEMA MIGRATION ERROR: " + e.getMessage());
            }
        };
    }
}
