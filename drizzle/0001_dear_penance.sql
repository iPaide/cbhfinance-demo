CREATE TABLE `cbh_accounts` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`account_type` enum('Checking','Savings','IRA') NOT NULL,
	`account_number` varchar(32) NOT NULL,
	`balance` decimal(14,2) NOT NULL,
	`opened_at` timestamp NOT NULL,
	`account_status` enum('Active','Suspended') NOT NULL DEFAULT 'Active',
	CONSTRAINT `cbh_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `cbh_accounts_account_number_unique` UNIQUE(`account_number`)
);
--> statement-breakpoint
CREATE TABLE `cbh_admin_logs` (
	`id` varchar(80) NOT NULL,
	`admin_id` varchar(64) NOT NULL,
	`action_type` varchar(64) NOT NULL,
	`target_user_id` varchar(64) NOT NULL,
	`details` text NOT NULL,
	`ip_address` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cbh_admin_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cbh_customers` (
	`id` varchar(64) NOT NULL,
	`full_name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`mailing_address` text NOT NULL,
	`member_since` varchar(64) NOT NULL,
	`routing_number` varchar(32) NOT NULL,
	`status` enum('Active','Suspended','Locked') NOT NULL DEFAULT 'Active',
	`two_fa_enabled` int NOT NULL DEFAULT 1,
	`failed_login_attempts` int NOT NULL DEFAULT 0,
	`last_login_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cbh_customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cbh_notifications` (
	`id` varchar(80) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(40) NOT NULL,
	`read_status` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cbh_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cbh_statements` (
	`id` varchar(100) NOT NULL,
	`account_id` varchar(64) NOT NULL,
	`period_start` timestamp NOT NULL,
	`period_end` timestamp NOT NULL,
	`file_url` text NOT NULL,
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cbh_statements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cbh_transactions` (
	`id` varchar(80) NOT NULL,
	`account_id` varchar(64) NOT NULL,
	`txn_account_type` enum('Checking','Savings','IRA') NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`direction` enum('credit','debit') NOT NULL,
	`method` enum('ACH','Wire','Zelle','Bill Pay','Internal','Interest','Investment','Admin') NOT NULL,
	`description` text NOT NULL,
	`reference_id` varchar(64) NOT NULL,
	`balance_after` decimal(14,2) NOT NULL,
	`txn_status` enum('Completed','Pending','Failed') NOT NULL DEFAULT 'Completed',
	`initiated_by` varchar(64) NOT NULL,
	`admin_id` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cbh_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `cbh_transactions_reference_id_unique` UNIQUE(`reference_id`)
);
