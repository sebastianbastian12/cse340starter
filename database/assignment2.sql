-- Inserting a new record to the table with `INSERT INTO` --
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Altering the type `Client` to `Admin` for Tony Start in the table --
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

-- Deleting the Tony Stak record from the table with `DELETE` --
DELETE FROM public.account WHERE account_id = 1;

-- Replacing a value in description of the table Inventory with `REPLACE` statement --
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior' ) WHERE inv_id = 10;

-- Joining two table through `INNER JOIN` statement for a specific category query --
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM public.inventory 
INNER JOIN public.classification on inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Replacing the image path for inv_image & inv_thumbnail of the table Inventory with `REPLACE` statement --
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/' ),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/' );