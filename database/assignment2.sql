-- TRUNCATE TABLE account RESTART IDENTITY;

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- SELECT * FROM account;

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- SELECT * FROM account;

Delete from account where account_id = 1;

-- SELECT * FROM account;

-- SELECT * FROM inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer';

UPDATE inventory SET inv_description = Replace(inv_description, 'small interiors', 'a huge interior') WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- SELECT * FROM inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT * FROM inventory INNER JOIN classification ON inventory.classification_id = classification.classification_id WHERE classification_name = 'Sport';

UPDATE inventory SET inv_image = Replace(inv_image, '/images', '/images/vehicles');
UPDATE inventory SET inv_thumbnail = Replace(inv_thumbnail, '/images', '/images/vehicles');

-- SELECT * FROM inventory;

