TRUNCATE TABLE account RESTART IDENTITY;

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

SELECT * FROM account;

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

SELECT * FROM account;

Delete from account where account_id = 1;

SELECT * FROM account;