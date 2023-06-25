const mongoose = require("mongoose")
const Document = require("./Document")
const dotenv = require ("dotenv");
dotenv.config()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const defaultValue = ""

// Add a variable to store the connected users
let users = [];

io.on("connection", socket => {
  socket.emit("welcome", { message: "Welcome!", id: socket.id });
  socket.on("join user", (data) => {
    const userExists = users.some((user) => user.id === data.id);

    if (!userExists) {
      const newUser = {
        id: data.id,
        name: data.name,
        usrId: data.usrId,
        documentId: data.documentId,
      };
      users.push(newUser);
    }

    io.emit("users updated", { users });
  });  

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users = users.filter((user) => user.id !== socket.id);
    io.emit("user disconnected", { users });
  });
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}
