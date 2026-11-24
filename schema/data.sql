-- =============================================================================
-- Initial Seed Records for Expense Tracker (MySQL 8+)
-- Sole System Administrator Account (itachi)
-- =============================================================================

INSERT INTO users (id, name, email, password, role, profession, currency, avatar, monthly_budget_alert_threshold, created_at)
VALUES 
(1, 'itachi', 'itachi@gmail.com', 'itachi@1313', 'ROLE_ADMIN', 'System Administrator', 'USD', 'https://api.dicebear.com/7.x/avataaars/svg?seed=itachi', 85, NOW())
ON DUPLICATE KEY UPDATE name='itachi', password='itachi@1313', role='ROLE_ADMIN';
