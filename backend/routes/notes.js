const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: Get All the Notes using: GET "/api/notes/getuser". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {

  console.log("hi notes")
    try {
        const notes = await Note.find({ user: req.user.id });
  res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
      }
  
});

// Route 2: Add a new Note using: POST "/api/notes/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
   
    const { title, description, tag } = req.body;
    // If there are errors, returns Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id
    })
    const saveNote = await note.save()

    res.json(saveNote)
         
} catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
  })

  // Route 3: Update an existing Note using: PUT "/api/notes/updatenote". login required
  router.put("/updatenote/:id", fetchuser, async (req, res) => {
    console.log("dfg")
    const {title, description, tag} = req.body;
    let note = await Note.findById(req.params.id);
    console.log(note, 61)
    //Create a newNote object
    const newNote = {};
    if(title){note.title = title};
    if(description){note.description = description};
    if(tag){note.tag = tag};

    //Find the note to be updated and updated it
     
    if(!note){return res.status(404).send("Not Found")}

    // if(!note.user.toString() !== req.user.id){
    //     return res.status(401).send("Not Allowed");
    // }

    // note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    note.save()
    res.json({note});
    })







 // Route 4: delete  an existing Note using: DELETE "/api/notes/deletenote". login required
 router.delete("/deletenote/:id", fetchuser, async (req, res) => {
 
  const {title, description, tag} = req.body;
  

  //Find the note to be deleted and deleted it
  //  let note = await Note.findById(req.params.id);
  // if(!note){return res.status(404).send("Not Found")}

  
  // //Allow deletion only if user owns this Note
  //   if(!note.user.toString() !== req.user.id){
  //   return res.status(401).send("Not Allowed");
  // }

   const note = await Note.findByIdAndDelete(req.params.id)

   console.log(note, 105)
   
   res.json({"Success": "Note has been deleted"});
  })


module.exports = router;
