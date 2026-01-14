const prisma = require("../../prisma/client");

exports.updateManagerProfile = async (req, res) => {
    try{
        const {name, phone, address} = req.body;
        const managerId = req.user.manager_id;

        const updateManager = await prisma.manager.update({
            where: {
                manager_id: managerId
            },
            data: {
                name,
                phone,
                address
            }
        });

        res.json({
            message: "Profile updated successfully",
            manager: {
                manager_id: updateManager.manager_id,
                email: updateManager.email,
                name: updateManager.name,
                phone: updateManager.phone,
                address: updateManager.address
            }
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
};