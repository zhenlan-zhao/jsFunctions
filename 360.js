
let prevLine=read_line()
let afterLine=read_line(); 

let len=prevLine.length;
let sA=0,sT=0,tA=0,tT=0;
for(let i=0;i<len;i++ ){
    if(prevLine[i]==afterLine[i]){
        continue;
    }
    if(prevLine[i]=="A"){
        sA++
    }
    if(prevLine[i]=="T"){
        sT++
    }
    if(afterLine[i]=="A"){
        tA++;
    }
    if(afterLine[i]=="T"){
        tT++;
    }
}

let prevSmall=Math.min(sA,sT);
let afterSmall=Math.min(tA,tT);
let smallOne=Math.min(prevSmall,afterSmall);
return (sA-smallOne+sT)