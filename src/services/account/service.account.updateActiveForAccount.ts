import { executeQuery } from "../../configs/database/database";

const updateActiveForAccountService = async (id: string) => {
    try {
        const updateActiveForAccountRes = await executeQuery(
            "UPDATE accounts SET is_active = 1 WHERE id = ?",
            [id]
        );

        return updateActiveForAccountRes ? true : false;
    } catch (error) {
        throw error;
    }
}

export default updateActiveForAccountService;