DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    product_id INTEGER (20) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (50) NOT NULL,
    department VARCHAR (50) NOT NULL,
    price DECIMAL (6, 3) NOT NULL,
    stock_quantity INTEGER (20) NOT NULL,
    PRIMARY KEY (product_id)
);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("Sony Headphones", "Headphones", "349.99", "1000"),
        ("Panasonic Headphones", "Headphones", "249.99", "500"),
        ("LG TV", "Televisions", "499.99", "250"),
        ("Samsung TV", "Televisions", "999.99", "100"),
        ("Purple Mattress", "Bedroom", "999.99", "1000"),
        ("Sleep Number Mattress", "Bedroom", "799.99", "300");