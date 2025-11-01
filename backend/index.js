const express = require("express");
const app = express();
const db = require("./db"); //importing the db
app.use(express.json());


app.get("/", (req, res) => {
  res.send("app started");
});
const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);//using the template literal
});

// adding the task
app.post("/add", (req, res) => {
  const { title, status } = req.body;

  const query = "INSERT INTO task (title, status) VALUES (?, ?)";

  db.query(query, [title, status || "pending"], (err, result) => {
    if (err) {
      console.error("Error inserting the data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("Data Inserted Successfully");
    return res.status(201).json({
      message: "Task added successfully!",
      insertedId: result.insertId,
    });
  });
});

//getting all the task
app.get("/all-task",(req,res) => {
    console.log("[get] api called");
    const query = "Select * from task";
    db.query(query,[],(err,result)=>{
        if(err)
        {
            console.log("Error getting the data",err);
            return res.status(200).json({error:true,message:"getting the data falied"});
        }

        console.log("Data fetched sucessfully");
        console.log("fetched all data",result);
        return res.status(200).json({
            success:true,
            message:"Data fetched sucessfully",
            reqData:result
        },)})
})

//deleting the task
app.delete("/del-task/:id",(req,res)=>{
    const {id} = req.params; // getting the id 
    console.log("[Delete] api called");
    console.log(id);
    const query = `Select * from task where id=${id}`;
    db.query(query,[],(error,result)=>{
        if(error)
        {
            console.log("error",error);
            return res.status(500).json({message:"Error connecting the database"})
        }
        
        console.log(result);
        return  res.status(200).json({success:true,message:"Deleted the task sucessfully"})
    })

}
)

//updating the status
app.put("/update-task/:id",(req,res)=>{
    console.log("[Update] api called");
    const {id} = req.params;
    console.log("updating the task:-",id);

    //get the status of an task
    const query = `select status from task where id = ${id}`;
   
    db.query(query,[],(error,result)=>{
            
        if(error) {
            console.log("Error from database",error);
            res.status(500).json({error:true,message:"Error from the database"});
        }
        let status = result[0].status;
        console.log("Status before updating",status);
        if(status == 'pending')
        {
            status = 'completed'
        }else {
            status = 'pending'
        }
        
        const statusQuery = `Update task set status='${status}' where id = ${id}`;
        db.query(statusQuery,[],(error,result)=>{
            if(error) {
                console.log("error from the db",error);
                return res.status(500).json({error:true,message:"Error from the database"});

            }
            console.log("Status after updating:-",result);
            return res.status(200).json({success:true,message:"updated the status" });
        })
        
        

    })
})

