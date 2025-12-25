const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../../prisma/client");

exports.setPassword = async (req, res) => {
    try{
        const {token, password} = req.body;
        if(!token || !password){
            return res.status(400).json({ message: "Token and password required"});
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const record = await prisma.passwordToken.findUnique({
            where: {token_hash: tokenHash},
            include: {manager: true}
        });

        if(!record || record.used) {
            return res.status(400).json({message: "Invalid or used token"});
        }

        if(record.expires_at < new Data()){
            return res.status(400).json({message: "Token expired"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.manager.update({
            where: {manager_id: record.manager_id},
            data: {
                password_hash: hashedPassword
            }
        });

        await prisma.passwordToken.update({
            where: {token_id: record.token_id},
            data: {used: true}
        });

        res.json({message: "password set successfully "});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
};