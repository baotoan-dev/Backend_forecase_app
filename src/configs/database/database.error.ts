
export enum DatabaseErrorStatus {
    PROTOCOL_CONNECTION_LOST = "PROTOCOL_CONNECTION_LOST",
    ER_CMD_CONNECTION_CLOSED = "ER_CMD_CONNECTION_CLOSED",
    ER_DUP_ENTRY = "ER_DUP_ENTRY",
    ER_NO_REFERENCED_ROW_2 = "ER_NO_REFERENCED_ROW_2",
    ER_DATA_TOO_LONG = "ER_DATA_TOO_LONG",
}

export class DatabaseError implements Error {
    code: string;
    message: string;
    name: string;

    constructor(code: string) {
        this.code = code;
        this.message = DatabaseErrorStatus[code];
        this.name = code;
    }
}