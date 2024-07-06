import { executeQuery } from "../../configs/database/database";

const updateStatusAndRolesForAccountService = async (id: string, roles: number, status: number) => {
    try {
        const updateRolesForAccountRes = await executeQuery(
            "UPDATE accounts SET role = ?, status = ? WHERE id = ?",
            [roles, status, id]
        );
        return updateRolesForAccountRes ? true : false;
    } catch (error) {
        throw error;
    }
}

export default updateStatusAndRolesForAccountService;
