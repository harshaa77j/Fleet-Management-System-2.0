const prisma = require("../../prisma/client");

exports.scheduleMaintenance = async (req, res) => {
    try{
        const{
            vehicle_id,
            maintenance_type,
            scheduled_date,
            description,
            previous_cost
        } = req.body;

        const companyId = req.user.companyId;

        if(!vehicle_id || !maintenance_type || !scheduled_date){
            return res.status(400).json({message: "Missing required fields"});
        }

        const vehicle = await prisma.vehicle.findFirst({
            where: {vehicle_id, company_id: companyId}
        });

        const maintenance = await prisma.maintenance.create({
            data: {
                vehicle_id,
                device_id: vehicle.device_id,
                maintenance_type,
                scheduled_data: new Data(scheduled_data),
                description,
                previous_cost
            }
        });

        res.status(201).json({
            message : "Maintenance scheduled",
            maintenance_id: maintenance.maintenance_id
        });
    }catch (error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.getTodayMaintenanceReminders = async (req, res) => {
    try{
        const companyId = req.user.companyId;
        
        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        const reminders = await prisma.maintenance.findMany({
            where: {
                scheduled_date: {gte: start, lte: end},
                vehicle:{
                    company_id: companyId,
                    status: {not: "IN_MAINTENANCE"}
                }
            },
            include: {
                vehicle: {
                    select: {
                        vehicle_id: true,
                        device_id: true,
                        status: true
                    }
                }
            }
        });

        res.json({
            count: reminders.length,
            reminders
        });

    }catch (error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.startMaintenance = async (req, res) => {
    try{
        const {maintenance_id} = req.params;
        const companyId = req.user.companyId;

        const maintenance = await prisma.maintenance.findFirst({
            where: {
                maintenance_id,
                vehicle: {company_id: companyId}
            },
            include: {vehicle: true}
        });

        if(!maintenance){
            return res.status(404).json({messgae: "Maintenance not found"});
        }

        const activeAssignment = await prisma.workerStats.findFirst({
            where: {
                vehicle_id: maintenance.vehicle_id,
                end_time: null
            }
        });

        if(activeAssignment){
            await prisma.workerStats.update({
                where: {worker_stats_id: activeAssignment.worker_stats_id},
                data: {end_time:  new Date()}
                });
            }

            await prisma.vehicle.update({
                where: {vehicle_id: maintenance.vehicle_id},
                data: {status: "IN_MAINTENANCE"}
            });

            res.json({message: "Maintenance started"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.completeMaintenance = async (req, res) => {
    try{
        const { maintenance_id} = req.params;
        const {cost} = req.body;
        const companyId = req.user.companyId;

        const maintenance = await prisma.maintenance.findFirst({
            where: {
                maintenance_id,
                vehicle: {companyId: companyId}
            }
        });

        if(!maintenance){
            return res.status(404).json({message: "Maintenance not found"});
        }

        await prisma.maintenance.update({
            where: {maintenance_id},
            data: {cost}
        });

        await prisma.vehicle.update({
            where: {vehicle_id: maintenance.vehicle_id},
            data:{status: "ACTIVE"}
        });

        res.json({message: "Maintenance.vehicle_id"});
    }catch (error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}