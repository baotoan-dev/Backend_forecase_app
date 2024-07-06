import { executeQuery } from "../../configs/database/database";

const updateRolesForAccountService = async (id: string, roles: number) => {
    try {
        const updateRolesForAccountRes = await executeQuery(
            "UPDATE accounts SET role = ? WHERE id = ?",
            [roles, id]
        );
        return updateRolesForAccountRes ? true : false;
    } catch (error) {
        throw error;
    }
}

export default updateRolesForAccountService;