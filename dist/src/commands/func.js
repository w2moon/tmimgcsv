var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("../logger");
const logger = logger_1.getLogger("csvidobj");
exports.default = (args) => __awaiter(this, void 0, void 0, function* () {
    const src = args[0];
    const dest = args[1];
    csvtojson_1.default({
        noheader: true,
        output: "json",
    }).fromFile(src).then((obj) => {
        let outobj = {};
        for (let i = 0; i < obj.length; ++i) {
            let o = obj[i];
            outobj[o.field1] = o.field3;
        }
        fs_1.default.writeFileSync(dest, "export default " + JSON.stringify(outobj));
    });
});
