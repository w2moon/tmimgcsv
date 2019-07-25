import chalk from "chalk";
import csv from "csvtojson";
import fs from "fs";
import _ from "lodash";
import ora from "ora";
import path from "path";
import prompts from "prompts";
import rimraf from "rimraf";
import through2 from "through2";
import { getLogger } from "../logger";

const logger = getLogger("csvidobj");



export default async (args:string[]) => {
  const src = args[0];
  const dest = args[1]; 
  csv({
    noheader:true,
    output:"json",
  }).fromFile(src).then(async (obj)=>{
    let outobj = {};
    for(let i=0;i<obj.length;++i){
      let o = obj[i];
      outobj[o.field1] = o.field3;
    }
    if(fs.existsSync(dest)){
      let res = await prompts({
        type: "text",
        name: "replace",
        message: `已存在文件，是否替换(y/n)?`
      });
      if(res.replace === "y"){
        console.log(`覆盖${dest}内容`);
        fs.writeFileSync(dest,"export default "+JSON.stringify(outobj)); 
        return; 
      }
      res = await prompts({
        type: "text",
        name: "replace",
        message: `是否添加以前不存在的key(y/n)?`
      });
      let addNewKey = false;
      if(res.replace === "y"){
        addNewKey = true;
      }
      const spanner = ora(`   正在替换...... `);
      // to replace
      let s = fs.readFileSync(dest).toString();
      let arr = s.match(/(\{.+\})/g);
      if(arr.length > 0){
        let oldContent = arr[0];
        console.log(`替换${dest}内容`);
        let head = s.substr(0,s.length-oldContent.length);
        console.log(`前缀${head}`);
        let oldobj = JSON.parse(oldContent);
       
          for(let k in outobj){
            if(!addNewKey ){
              if(oldobj[k] && oldobj[k]!=outobj[k]){
                oldobj[k] = outobj[k];
                spanner.succeed(`替换了${k}`);
              }
              
            }
            else{
              if(oldobj[k] != outobj[k]){

                oldobj[k] = outobj[k];
                spanner.succeed(`替换了${k}`);
              }
            }
            
          }
        
        
        fs.writeFileSync(dest,head+JSON.stringify(oldobj));
        spanner.succeed("完成");  
      }
      else{
        console.log(`覆盖${dest}内容`);
        fs.writeFileSync(dest,"export default "+JSON.stringify(outobj)); 
      }
      
    }
    else{
      console.log(`生成新${dest}`);
      fs.writeFileSync(dest,"export default "+JSON.stringify(outobj));

    }
  })
  
};
