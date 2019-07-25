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
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
const logger_1 = require("../logger");
const logger = logger_1.getLogger("csvidobj");
exports.default = (args) => __awaiter(this, void 0, void 0, function* () {
    const src = args[0];
    const dest = args[1];
    csvtojson_1.default({
        noheader: true,
        output: "json",
    }).fromFile(src).then((obj) => __awaiter(this, void 0, void 0, function* () {
        let outobj = {};
        for (let i = 0; i < obj.length; ++i) {
            let o = obj[i];
            outobj[o.field1] = o.field3;
        }
        if (fs_1.default.existsSync(dest)) {
            let res = yield prompts_1.default({
                type: "text",
                name: "replace",
                message: `已存在文件，是否替换(y/n)?`
            });
            if (res.replace === "y") {
                console.log(`覆盖${dest}内容`);
                fs_1.default.writeFileSync(dest, "export default " + JSON.stringify(outobj));
                return;
            }
            res = yield prompts_1.default({
                type: "text",
                name: "replace",
                message: `是否添加以前不存在的key(y/n)?`
            });
            let addNewKey = false;
            if (res.replace === "y") {
                addNewKey = true;
            }
            const spanner = ora_1.default(`   正在替换...... `);
            let s = fs_1.default.readFileSync(dest).toString();
            let arr = s.match(/(\{.+\})/g);
            if (arr.length > 0) {
                let oldContent = arr[0];
                console.log(`替换${dest}内容`);
                let head = s.substr(0, s.length - oldContent.length);
                console.log(`前缀${head}`);
                let oldobj = JSON.parse(oldContent);
                for (let k in outobj) {
                    if (!addNewKey) {
                        if (oldobj[k] && oldobj[k] != outobj[k]) {
                            oldobj[k] = outobj[k];
                            spanner.succeed(`替换了${k}`);
                        }
                    }
                    else {
                        if (oldobj[k] != outobj[k]) {
                            oldobj[k] = outobj[k];
                            spanner.succeed(`替换了${k}`);
                        }
                    }
                }
                fs_1.default.writeFileSync(dest, head + JSON.stringify(oldobj));
                spanner.succeed("完成");
            }
            else {
                console.log(`覆盖${dest}内容`);
                fs_1.default.writeFileSync(dest, "export default " + JSON.stringify(outobj));
            }
        }
        else {
            console.log(`生成新${dest}`);
            fs_1.default.writeFileSync(dest, "export default " + JSON.stringify(outobj));
        }
    }));
});
