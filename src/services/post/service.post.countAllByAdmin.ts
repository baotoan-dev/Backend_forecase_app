import { executeQuery } from "../../configs/database/database";

export async function countAllPostsByAdminService() {
    return await executeQuery(
        "SELECT COUNT(posts.id) as total FROM posts;"
    );
}