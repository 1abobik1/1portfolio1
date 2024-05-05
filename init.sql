CREATE TABLE IF NOT EXISTS "Feedback" (
   id SERIAL PRIMARY KEY,
   "firstName" VARCHAR(255),
   "lastName" VARCHAR(255),
   "email" VARCHAR(255),
   "phoneNumber" VARCHAR(255),
   "message" VARCHAR(255)
);