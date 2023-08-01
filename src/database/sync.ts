import { entities } from "./entities";

export function databaseSync(): void {
    entities.forEach(async (entitie: any) => {
        await entitie?.sync({ alter: true });
    });
}