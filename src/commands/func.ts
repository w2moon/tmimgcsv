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
  }).fromFile(src).then((obj)=>{
    let outobj = {};
    for(let i=0;i<obj.length;++i){
      let o = obj[i];
      outobj[o.field1] = o.field3;
    }
    fs.writeFileSync(dest,"export default "+JSON.stringify(outobj));
  })
  
};
