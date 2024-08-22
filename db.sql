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
    category    int                      not null,
    location    int                      not null,
    description varchar(255)             null,
    date        datetime default (now()) not null,
    photo       varchar(255)             null,
    constraint items_categories_id_fk
        foreign key (category) references categories (id),
    constraint items_locations_id_fk
        foreign key (location) references locations (id)
);

insert into categories (id, name, description)
values  (1, 'Technique', 'Technique description'),
        (2, 'Furniture', 'Furniture description'),
        (3, 'Documents', 'Documents description');

insert into locations (id, name, description)
values  (1, 'Teacher''s room', 'Teacher''s room description'),
        (2, 'Director''s office', 'Director''s office description'),
        (3, 'Kitchen', 'Description of the kitchen');

insert into items (id, name, category, location, description, date, photo)
values  (1, 'Computer', 1, 2, 'Some computer', '2024-08-21 15:01:52', 'computer.jpg'),
        (2, 'Table', 2, 3, 'Description of some table', '2024-08-21 15:03:34', null),
        (3, 'Documents', 3, 1, 'Documents description', '2024-08-21 15:06:50', 'document.jpg');