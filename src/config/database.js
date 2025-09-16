import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database/ProjetoBackStack.sqlite"),
    logging: false,
    define: {
        timestamps: true,
        underscored: false,
    }
});