const prisma = require("../../prisma/client");

exports.addVehicle = async (req, res) => {
    try{
        const {device_id, model, manufacturer, battery_capacity_ah} = req.body;
        const companyId = req.user.companyId;

        if(!device_id || !model || !manufacturer) {
            return res.status(400).json({message: "device_id, model and manufacturer are required"});
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                device_id,
                model,
                manufacturer,
                battery_capacity_ah,
                company_id: companyId,
                status: "ACTIVE"
            }
        });

        res.status(201).json({
            message: "vehicle added successfully",
            vehicle: {
                vehicle_id: vehicle.vehicle_id,
                device_id: vehicle.device_id,
                status: vehicle.status
            }
        });
    }catch (error){
        console.error(error);

        if(error.code === "P2002") {
            return res.status(409).json({
                message: "Device ID already exist"
            });
        }

        res.status(500).json({message: "Server error"});
    }
};

exports.listVehicles = async (req, res) => {
    try{
        const companyId = req.user.companyId;

        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const statusFilter = req.query.status ? req.query.status.split(",") : ["ACTIVE","IN_MAINTENANCE"];

        const vehicles = await prisma.vehicle.findMany({
            where: {
                company_id: companyId,
                status: {
                    in: statusFilter
                }
            },
            select: {
                vehicle_id: true,
                device_id: true,
                status: true,
                battery_capacity_ah: true
            },
            orderBy: {
                created_at: "desc"
            },
            take: limit,
            skip: offset
        });

        const totalCount = await prisma.vehicle.count({
            where: {
                company_id: companyId,
                status: {
                    in: statusFilter
                }
            }
        });

        res.json({
            total: totalCount,
            limit,
            offset,
            vehicles
        });
    }catch (error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.getVehicleDashboard = async (req, res) => {
    try{
        const {vehicle_id } = req.params;
        const companyId = req.user.companyId;

        const vehicle = await prisma.vehicle.findFirst({
            where: {
                vehicle_id,
                company_id: companyId
            },
            select: {
                vehicle_id: true,
                device_id: true,
                model: true,
                manufacturer: true,
                battery_capacity_ah: true,
                nominal_voltage_v: true,
                status: true,
                created_at: true
            }
        });

        if(!vehicle) {
            return res.status(404).json({message: "vehicle not found"});
        }

        const telemetry = await prisma.vehicleStats.findMany({
            where: {
                vehicle_id: vehicle.vehicle_id
            },
            select: {
                vehicle_stats_id: true,
                recorded_at: true,
                soc: true,
                voltage: true,
                current: true,
                temperature: true,
                authenticated: true,
                worker_id: true,
                biometric_id: true
            },
            orderBy: {
                recorded_at: "desc"
            },
            take: 50
        });

        res.json({
            vehicle,telemetry
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
};