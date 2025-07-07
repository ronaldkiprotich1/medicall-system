"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.testConnection = exports.complaints = exports.payments = exports.prescriptions = exports.appointments = exports.doctors = exports.users = exports.db = exports.client = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = __importStar(require("./schema"));
// Initialize the client
exports.client = new pg_1.Client({
    connectionString: process.env.Database_URL
});
// Connect to database
const main = async () => {
    await exports.client.connect();
};
main()
    .then(() => console.log("Connected to the database"))
    .catch((error) => console.error("Error connecting to the database:", error));
// Create drizzle instance
exports.db = (0, node_postgres_1.drizzle)(exports.client, { schema, logger: true });
// Export individual tables for easier access
exports.users = schema.users, exports.doctors = schema.doctors, exports.appointments = schema.appointments, exports.prescriptions = schema.prescriptions, exports.payments = schema.payments, exports.complaints = schema.complaints;
// Export connection utilities
const testConnection = async () => {
    try {
        await exports.client.query("SELECT 1");
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.testConnection = testConnection;
const closeConnection = async () => {
    await exports.client.end();
};
exports.closeConnection = closeConnection;
// Default export remains db
exports.default = exports.db;
