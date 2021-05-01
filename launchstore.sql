DROP DATABASE IF EXISTS "launchstore";
CREATE DATABASE "launchstore";

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (NOW()),
  "updated_at" timestamp DEFAULT (NOW())
)

-- FOREIGN KEYS
ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

-- INSERTS
INSERT INTO "categories" (name) VALUES ('comida');
INSERT INTO "categories" (name) VALUES ('eletronicos');
INSERT INTO "categories" (name) VALUES ('informática');

/* TRIGGERS & PROCEDURES */
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$	
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Connect PG Simple
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

--password token
ALTER TABLE "users" add column reset_token text;
ALTER TABLE "users" add column reset_token_expires text;