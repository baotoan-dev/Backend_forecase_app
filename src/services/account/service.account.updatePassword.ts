import { executeQuery } from "../../configs/database/database";

const updatePasswordForAccountService = async (id: string, password: string) => {
    try {
        const updatePasswordForAccountRes = await executeQuery(
            "UPDATE accounts SET password = ? WHERE id = ?",
            [password, id]
        );

        return updatePasswordForAccountRes ? true : false;
    } catch (error) {
        throw error;
    }
}

export default updatePasswordForAccountService;