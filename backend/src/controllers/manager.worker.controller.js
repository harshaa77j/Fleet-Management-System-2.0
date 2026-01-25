const prisma = require("../../prisma/client");

exports.addWorker = async (req, res) => {
    try {
        const{
            biometric_id,
            name,
            phone,
            address,
            blood_group,
            dob
        } = req.body;

        const managerId = req.user.manager_id;
        const companyId = req.user.companyId;

        if(!biometric_id || !name) {
            return res.status(400).json({message: "biometric_id and name are required"});
        }

        const worker = await prisma.worker.create({
            data: {
                biometric_id,
                name,
                phone,
                address,
                blood_group,
                dob: dob ? new Date(dob) : null,
                manager_id: managerId,
                company_id: companyId,
                status: "ACTIVE"
            }
        });

        res.status(201).json({
            meesage : "Worker added successfully",
            worker: {
                worker_id: worker.worker_id,
                biometric_id: worker.biometric_id,
                name: worker.name,
                status: worker.status
            }
        });
    }catch (error) {
        console.error(error);

        if(error.code === "P2002") {
            return res.status(409).json({ message : "Biometric already exists"});
        }
        res.status(500).json({message: " server error"});
    }
};

exports.listWorkers = async (req, res) => {
    try{
        const companyId = req.user.companyId;

        const workers = await prisma.worker.findMany({
            where: {
                company_id: companyId,
                status: "ACTIVE"
            },
            select: {
                worker_id: true,
                biometric_id: true,
                name: true,
                status: true,
                workerStats: {
                    where: {
                        end_time: null
                    },
                    orderBy: {
                        created_at: "desc"
                    },
                    take: 1,
                    select: {
                        vehicle_id: true,
                        attendance_status: true,
                        start_time: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });

        const formatted = workers.map(w => ({
            worker_id: w.worker_id,
            biometric_id: w.biometric_id,
            name: w.name,
            status: w.status,
            assigned_vehicle_id: w.workerStats[0]?.vehicle_id || null,
            attendance_status: w.workerStats[0]?.attendance_status || "ABSENT",
            start_time: w.workerStats[0]?.start_time || null
        }));
        
        res.json({
            total: formatted.length,
            workers: formatted
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
};

exports.assignWorkerToVehicle = async (req, res) => {
    try{
        const {worker_id, vehicle_id} = req.body;
        const companyId = req.user.companyId;

        if(!worker_id || !vehicle_id){
            return res.status(400).json({message : "worker_id and vehicle_id are requried"});
        }

        const worker = await prisma.worker.findFirst({
            where: {
                worker_id,
                company_id: companyId,
                status: "ACTIVE"
            }
        });

        if(!worker) {
            return res.status(404).json({message: "worker not found"});
        }

        const vehicle = await prisma.vehicle.findFirst({
            where: {
                vehicle_id,
                company_id: companyId,
                status: {
                    not: "RETIRED"
                }
            }
        });

        if(!vehicle) {
            return res.status(404).json({message : "vehicle not found"});
        }

        const activeWorkerAssignment = await prisma.workerStats.findFirst({
            where: {
                worker_id,
                end_time: null
            }
        });

        if(activeWorkerAssignment) {
            return res.status(409).json({message: "worker is already assigned to a vehicle"});
        }

        const activeVehicleAssignment = await prisma.workerStats.findFirst({
            where: {
                vehicle_id,
                end_time: null
            }
        });

        if(activeVehicleAssignment) {
            return res.status(409).json({message: "vehicle already has a worker assigned"});
        }

        const assignment = await prisma.workerStats.create({
            data: {
                worker_id,
                biometric_id: worker.biometric_id,
                vehicle_id,
                attendance_status: "ABSENT",
                start_time: new Date()
            }
        });

        res.status(201).json({
            message: "worker assigned to vehicle successfully",
            assignment: {
                worker_id,
                vehicle_id,
                start_time: assignment.start_time
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};