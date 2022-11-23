import express from "express";
const app = express();
import path from 'path'
import fs from "fs";

const __dirname = path.resolve();

app.use(express.json());

app.get("/", (req, res) => {

    var options = {
        root : path.join(__dirname)
    };

    var filename = './client/form/form.html'; 

    res.sendFile(filename, options)
});

function checkString(str){
  for (let index = 0; index < str.length; index++) {
    if(str[index]!==' ' && str[index]<=9 && str[index]>=0){
      return false;
    }
  }
  return true;
}


app.post("/register", (req, res) => {
  let data = req.body;
  console.log(req.body);
  let usersjson = fs.readFileSync("data.json", "utf-8");
  let users = JSON.parse(usersjson);
  var flag = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == data.id) {
      flag = true;
      break;
    }
  }

  if (flag) {
    res.send({ msg: "student already exist with particular id" });
  } else {
    if(!data.name || !data.id || !data.address || !data.m1 || !data.m2 || !data.m3 || !data.m4 || !data.m5){
      res.send({ msg: "Check whether all the fields are filled" });

    }else if(!checkString(data.name)){
      res.send({ msg: "No numerical value allowed in name" });
    }
    else if(data.m1<0 || data.m2<0 || data.m3<0 || data.m4<0 || data.m5<0 || data.m1>100 || data.m2>100 || data.m3>100 || data.m4>100 || data.m5>100){
      res.send({ msg: "All the marks should be in between 1-100" });
    }else{

    var average =
      (parseInt(data.m1) +
        parseInt(data.m2) +
        parseInt(data.m3) +
        parseInt(data.m4) +
        parseInt(data.m5)) /
      5;

    var grade = null;  
    if(average>=90){
        grade = 'A'
    }else  if(average>=80){
        grade = 'B'
    }else  if(average>=70){
        grade = 'C'
    }else  if(average>=60){
        grade = 'D'
    }else  if(average>=50){
        grade = 'E'
    }else {
        grade = 'F'
    }

    var total =
      parseInt(data.m1) +
      parseInt(data.m2) +
      parseInt(data.m3) +
      parseInt(data.m4) +
      parseInt(data.m5);
    data = { ...data, avg: average, total: total, grade : grade };
    users.push(data);
    usersjson = JSON.stringify(users);
    fs.writeFileSync("data.json", usersjson, "utf-8");
    res.send({ msg: "Data register successfully" });
    // res.json(data);
  }
  }
});

app.get("/showall", (req, res) => {
  const data = fs.readFileSync("data.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  res.json(JSON.parse(data));
});


const port = 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

