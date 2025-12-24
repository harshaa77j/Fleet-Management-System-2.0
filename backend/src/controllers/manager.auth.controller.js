const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/client");

exports.managerLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password required"});
        }

        const manager = await prisma.manager.findUnique({
            where: {email}
        });

        if(!manager) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        if(!manager.password_hash){
            return res.status(403).json({message: "password is not set. Please check your email"});
        }

        const isMatch = await bcrypt.compare(password, manager.password_hash);
        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            {
                manager_id: manager.manager_id,
                email:manager.email,
                companyId: manager.companyId,
                type: "MANAGER"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "24h"
            }
        );
        
        res.json({message: "Login successful", token});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "server error"});
    }
};