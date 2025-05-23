const express = require("express");
const fs = require('fs')
const users = require("./MOCK_DATA.json");

const app= express();
const PORT =8000;
//Middleware -plugin
app.use(express.urlencoded({extended: false}));
app.use((req,res,next)=>{
    fs.appendFile(
        "log.txt",
        `${Date.now()}:${req.ip}${req.method}:${req.path}`,
        (err,data)=>{
            next();
        }
    );
}); 
app.use((req,res,next)=>{
    console.log("hello from middleware 2");
    
    next();
});


//Routes
app.get('/users',(req,res)=>{
    const html =`
    <ul>
    ${users.map(user=>`<li>${user.first_name}</li>`).join("")}
    <ul>`;
    res.send(html);
})
//REST API
app.get("/api/users/",(req,res)=>{
    return res.json(users);
})
app.route('/api/users/:id').get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=> user.id ===id);
    return res.json(user);
}).put((req,res)=>{
    const body = req.body;
    const id=body.id;
    users=users.map(user=>user.id===id?{...user,...body}:user);
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        return res.json({status:"success",id});
    });
    
}).delete((req,res)=>{
    const id=req.body.id;
    users=users.filter(user=>user.id!==id);
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        return res.json({status:"success",id});
    });
});


app.post('/api/users',(req,res)=>{
    const body = req.body;
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"success",id:users.length});
    });
    //console.log("Body",body);
    
});


app.listen(PORT,()=> console.log(`Server started at port:${PORT}`));
