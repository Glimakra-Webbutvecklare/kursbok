export function findWorkshop(workshops, workshopId) {
  return workshops.find((workshop) => workshop.id === workshopId);
}

export function findSlot(workshop, slotId) {
  return workshop.slots.find((slot) => slot.id === slotId);
}
