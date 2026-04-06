import { Prescription } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class PrescriptionRepository extends BaseRepository<Prescription> {
  constructor() {
    super("prescription");
  }

  async findByAppointment(appointmentId: string): Promise<Prescription[]> {
    return this.findAll({
      where: { appointmentId },
      orderBy: { createdAt: "desc" },
    });
  }
}
