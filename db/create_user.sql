INSERT INTO users_bcrypt(name, email, username,password) VALUES (${name}, ${email}, ${username}, ${hashedPassword}) RETURNING *;