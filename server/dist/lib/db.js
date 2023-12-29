"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class DataProvider {
    static getDatabaseInstance() {
        if (this.dbClient) {
            return this.dbClient;
        }
        else {
            this.dbClient = new client_1.PrismaClient();
            return this.dbClient;
        }
    }
}
DataProvider.dbClient = undefined;
exports.default = DataProvider.getDatabaseInstance();
//# sourceMappingURL=db.js.map