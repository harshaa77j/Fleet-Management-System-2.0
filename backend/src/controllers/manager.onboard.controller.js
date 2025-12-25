const prisma = require("../../prisma/client");
const { v4: uuidv4 } = require("uuid");
const {generatePasswordToken} = require("../utils/passwordToken");
const {sendEmail}= require("../utils/email");
const {setPasswordEmail} = require("../utils/emailTemplates");

exports.onboardManager = async (req, res) => {
    try{
        // const {activationKey, email, name, phone, address} = req.body;
        const {activationKey, email} = req.body;

        if(!activationKey || !email) {
            return res.status(400).json ({ message : "Activation key and email are required"});
        }

        // const keyRecord = await prisma.activationKey.findUnique({
        //     where: {key: activationKey},
        //     include: {company: true}
        // });

        // if(!keyRecord){
        //     return res.status(401).json({message: "Invalid activation key"});
        // }

        // if(keyRecord.status !== "ACTIVE") {
        //     return res.status(403).json({message: "Activation key is not active"});
        // }

        // if(!keyRecord.company) {
        //     return res.status(500).json({message: "Activation key is not linked to company"});
        // }
        const keyRecord = await prisma.activationKey.findUnique({
            where: { key: activationKey},
            include: {
                company: {
                    include: {
                        managers: true
                    }
                }
            }
        });

        if(!keyRecord) {
            return res.status(401).json({message: "Invalid activation key"});
        }

        if(keyRecord.expires_at && keyRecord.expires_at < new Date()) {
            await prisma.activationKey.update({
                where: { key_id: keyRecord.key_id},
                data: { status: "EXPIRED"}
            });
            return res.status(403).json({message: "Activation key expired"});
        }

        if(keyRecord.status !== "ACTIVE") {
            return res.status(403).json({message: `Activation key is ${keyRecord.status.toLowerCase()}`});
        }

        if(!keyRecord.company) {
            return res.status(500).json({message: "Activation key not linked to company"});
        }

        if(keyRecord.company.managers.length > 0){
            return res.status(403).json({message : "Activation key already used "});
        }

        const existingManager = await prisma.manager.findUnique({
            where: {email}
        });

        if(existingManager) {
            return res.status(409).json({message : "Manager with this email already exists"});
        }

        const manager = await prisma.manager.create({
            data:{
                manager_id: uuidv4(),
                email,
                companyId: keyRecord.company.company_id,
                password_hash: ""
            }
        });

        await prisma.activationKey.update({
            where: {key_id: keyRecord.key_id},
            data : {
                status: "USED",
                start_data:  new Data()
            }
        });

        res.status(201).json({
            message: "Activation successful. please check your email to set password",
            manager_id: manager.manager_id
            // company: {
            //     id: keyRecord.company.company_id,
            //     name: keyRecord.company.name
            // }
        });
    }catch (error){
        console.log(error);
        res.status(500).json({message: "server error"});
    }
};

const {rawToken, hash} = generatePasswordToken();

await prisma.passwordToken.create({
    data: {
        token_id: uuidv4(),
        token_hash: hash,
        manager_id: manager.manager_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000)
    }
});

// console.log(
//     `SET PASSWORD LINK: https://localhost:5001/set-password?token=${rawToken}`
// );

const link = `${process.env.APP_BASE_URL}/set-password?token=${rawToken}`;

await sendEmail({
    to: manager.email,
    subject: "Set your password",
    html: setPasswordEmail(link)
});