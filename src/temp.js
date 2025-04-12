const bcrypt = require("bcryptjs");

const plainPassword = "admin123";

async function hello(){
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(hashedPassword);
}
hello()