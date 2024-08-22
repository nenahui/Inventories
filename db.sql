create schema inventory collate utf8mb4_general_ci;
use inventory;

create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) null
);

create table locations
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) null
);

create table items
(
    id          int auto_increment
        primary key,
    name        varchar(255)             not null,
    category_id    int                      not null,
    location_id    int                      not null,
    description varchar(255)             null,
    date        datetime default (now()) not null,
    photo       varchar(255)             null,
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_locations_id_fk
        foreign key (location_id) references locations (id)
);

insert into categories (name, description)
values  ('Electronics', 'Various electronic devices'),
        ('Office Supplies', 'Items used in the office'),
        ('Appliances', 'Household appliances');

insert into locations (name, description)
values  ('Meeting Room', 'Room for meetings and discussions'),
        ('Storage Room', 'Room for storing various items'),
        ('Reception', 'Area for welcoming visitors');

insert into items (name, category_id, location_id, description, photo)
values  ('Printer', 1, 3, 'Office printer', 'printer.jpg'),
        ('Chair', 2, 1, 'Comfortable chair for the meeting room', null),
        ('Microwave', 3, 2, 'Kitchen microwave', 'microwave.jpg'),
        ('Laptop', 1, 2, 'Personal laptop for director', 'laptop.jpg'),
        ('Projector', 1, 1, 'Projector for presentations', 'projector.jpg'),
        ('Desk Lamp', 2, 3, 'Lamp for reading and working', 'lamp.jpg'),
        ('File Cabinet', 3, 2, 'Cabinet for storing documents', null);