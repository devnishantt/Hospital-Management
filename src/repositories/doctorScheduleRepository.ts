import { DoctorSchedule } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class DoctorScheduleRepository extends BaseRepository<DoctorSchedule> {
  constructor() {
    super("doctorSchedule");
  }

  async findByDoctor(doctorId: string): Promise<DoctorSchedule[]> {
    return this.findAll({ where: { doctorId, isActive: true } });
  }

  async findActiveByDoctorAndDay(
    doctorId: string,
    dayOfWeek: number,
  ): Promise<DoctorSchedule[]> {
    return this.findAll({
      where: {
        doctorId,
        isActive: true,
        dayOfWeek: { has: dayOfWeek },
      },
    });
  }
}
