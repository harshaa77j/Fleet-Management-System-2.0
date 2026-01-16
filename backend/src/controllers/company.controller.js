const prisma = require("../../prisma/client");
const {v4: uuidv4} = require("uuid");
const { generateActivationKey } = require("../utils/activationKey");

exports.createCompany = async (req, res) => {
    try {
        console.log("Admin", req.user);
        const {name, email, phone, address} = req.body;

        if(!email){
            return res.status(400).json({message: "Company email is required"});
        }

        console.log("Before activation key create");
        const activationKey = await prisma.activationKey.create({
            data: {
                key_id: uuidv4(),
                key: generateActivationKey(),
                status:"ACTIVE"
            }
        });

        console.log("After activation key create");

        console.log("Before company create");

        const company = await prisma.company.create({
            data: {
                company_id: uuidv4(),
                name,
                email,
                phone,
                address,
                activationKeyId: activationKey.key_id,
                created_by_admin_id: req.user.admin_id
            }
        });

        console.log("After company create");

        return res.status(201).json({
                message: "company created successfully",
                activationKey: activationKey.key,
                company
            });
    }catch (error){
        console.log(error);

        if(error.code === "P2002") {
            return res.status(409).json({ message : "company or activation key already exists"});
        }

        res.status(500).json({message:"server error"});
    }
};

exports.getCompanies = async (req, res) => {
    try {
        const compaines = await prisma.company.findMany({
            orderBy: {
                created_at : "desc"
            },
            include: {
                activationKey: true,
                managers: false
            }
        });

        res.json(compaines);
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
};