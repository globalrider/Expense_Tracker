package com.expensetracker.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String welcome() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Expense Tracker Backend API</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: #0f172a;
                        color: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .card {
                        background: #1e293b;
                        border: 1px solid #334155;
                        border-radius: 16px;
                        padding: 36px;
                        max-width: 640px;
                        width: 100%;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                    }
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: rgba(16, 185, 129, 0.15);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 13px;
                        font-weight: 600;
                    }
                    .dot {
                        width: 8px;
                        height: 8px;
                        background: #10b981;
                        border-radius: 50%;
                    }
                    h1 {
                        margin: 16px 0 8px 0;
                        font-size: 24px;
                    }
                    p {
                        color: #94a3b8;
                        font-size: 14px;
                        line-height: 1.6;
                        margin: 0 0 24px 0;
                    }
                    .links {
                        display: grid;
                        gap: 12px;
                    }
                    .btn {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 18px;
                        border-radius: 12px;
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 14px;
                        transition: all 0.2s;
                    }
                    .btn-primary {
                        background: #4f46e5;
                        color: white;
                    }
                    .btn-primary:hover {
                        background: #4338ca;
                    }
                    .btn-secondary {
                        background: #334155;
                        color: #f1f5f9;
                    }
                    .btn-secondary:hover {
                        background: #475569;
                    }
                    .ports {
                        background: #0f172a;
                        border: 1px solid #1e293b;
                        padding: 16px;
                        border-radius: 12px;
                        margin-bottom: 20px;
                        font-size: 13px;
                    }
                    .port-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 4px 0;
                    }
                    .port-num {
                        font-family: monospace;
                        font-weight: bold;
                        color: #38bdf8;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <span class="badge"><span class="dot"></span> Backend Online</span>
                    <h1>Expense Tracker Spring Boot 3</h1>
                    <p>The backend REST API is running successfully. Here are the ports and services:</p>

                    <div class="ports">
                        <div class="port-row">
                            <span>🎨 <strong>Frontend User Interface</strong> (React App):</span>
                            <span class="port-num">Port 5173</span>
                        </div>
                        <div class="port-row">
                            <span>🍃 <strong>Backend REST API</strong> (Spring Boot):</span>
                            <span class="port-num">Port 8080</span>
                        </div>
                        <div class="port-row">
                            <span>🗄️ <strong>Database</strong> (MySQL / H2 Fallback):</span>
                            <span class="port-num">Port 3306</span>
                        </div>
                    </div>

                    <div class="links">
                        <a href="http://localhost:5173" class="btn btn-primary" target="_blank">
                            <span>Open Frontend UI</span>
                            <span>http://localhost:5173 &rarr;</span>
                        </a>
                        <a href="/swagger-ui.html" class="btn btn-secondary">
                            <span>Swagger / OpenAPI Documentation</span>
                            <span>/swagger-ui.html &rarr;</span>
                        </a>
                        <a href="/h2-console" class="btn btn-secondary">
                            <span>H2 Database Console</span>
                            <span>/h2-console &rarr;</span>
                        </a>
                    </div>
                </div>
            </body>
            </html>
            """;
    }
}
