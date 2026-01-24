const prisma = require("../../prisma/client");

exports.getTelemetryHistory = async (req, res) => {
    try{
        const {vehicle_id} = req.params;
        const companyId = req.user.companyId;

        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const vehicle = await prisma.vehicle.findFirst({
            where: {
                vehicle_id,
                company_id: companyId
            },
            select: {vehicle_id: true}
        });

        if(!vehicle){
            return res.status(404).json({message: "vehicle not found"});
        }

        const timeFilter = {};
        if(req.query.from) timeFilter.gte = new Date(req.query.from);
        if(req.query.to) timeFilter.lte = new Date(req.query.to);

        const telemetry = await prisma.vehicleStats.findMany({
            where: {
                vehicle_id,
                ...(Object.keys(timeFilter).length && {
                    recorded_at: timeFilter
                })
            },
            orderBy: {
                recorded_at: "desc"
            },
            take: limit,
            skip: offset
        });
        
        res.json({
            limit,
            offset,
            telemetry
        });
    }catch(error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.getTelemetryCharts = async (req, res) => {
    try{
        const {vehicle_id} =req.params;
        const companyId = req.user.companyId;

        const range = req.query.range || "24h";

        const rangeMap = {
            "1h": 1,
            "6h": 6,
            "24h": 24,
            "7d": 168
        };

        const vehicle = await prisma.vehicle.findFirst({
            where: {
                vehicle_id,
                company_id: companyId
            },
            select: {vehicle_id: true}
        });

        if(!vehicle) {
            return res.status(404).json({message : "vehicle not found"});
        }

        const fromTime = new Date(Date.now() - hours * 60 * 60 * 1000);

        const telemetry = await prisma.vehicleStats.findMany({
            where: {
                vehicle_id,
                recorded_at: {gte: fromTime}
            },
            orderBy: {
                recorded_at: "acs"
            },
            select: {
                recorded_at: true,
                soc: true,
                voltage: true,
                current: true,
                temperature: true
            }
        });

        res.json({
            range,
            points: telemetry
        });
    }catch(errror) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
};