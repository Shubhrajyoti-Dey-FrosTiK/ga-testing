import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

/*-------- Routes --------*/
import Group from "./routes/Group.controller";
import Student from "./routes/Student.controller";
import Recruiter from "./routes/Recruiter.controller";
import Company from "./routes/Company.controller";
import Token from "./routes/Token.controller";
import Register from "./routes/Register.controller";

// import { verifyToken } from "./middleware/auth";
// verifyToken(
//   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2NzE1ZTJmZjcxZDIyMjQ5ODk1MDAyMzY2ODMwNDc3Mjg2Nzg0ZTMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoic3VtYW4gZGV5IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFk2ODRWWnR0YUp1MDBIaEdzOWtjWTZWaW9Tc2FiZTFPSW4wTHJzZWc9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3Jvdy1zaW1wbGUtYTZiYWUiLCJhdWQiOiJncm93LXNpbXBsZS1hNmJhZSIsImF1dGhfdGltZSI6MTY4MzY4MTMyMCwidXNlcl9pZCI6IktZOEwwQWFITExWOHEwNFdYYzN6UG5oUXJTZDIiLCJzdWIiOiJLWThMMEFhSExMVjhxMDRXWGMzelBuaFFyU2QyIiwiaWF0IjoxNjgzNjgxMzIwLCJleHAiOjE2ODM2ODQ5MjAsImVtYWlsIjoidG9zdW1hbmRleTc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTEyODgxMjA4NzcxMTA0Mjg3ODk5Il0sImVtYWlsIjpbInRvc3VtYW5kZXk3N0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.yqQ1PEDIDuY-CsdUoqH3Z_kTRAFSBXyfPEfW6Wiw96x15UMHsGQhw0BM6GzaatWMdCdTzPjrmqgHGBkjYiFmT0KgQ-nxnTZtKMN0NW790G5u16fdmqXz-CZ_ceRkvlRw5VYvlFnRAETZ977NZ-6cQBGdH5DKq-joFxx5tAaDmzTWf3ABTkcKLJa80klASbvujBgNgVq5x0rmOcIsdS3HiLpnmOGUkfBNin0Vh1WyJ2l_2GncBNW0xnxbohE3GkrOxv0nerlF-e9ZG6hroGQnz6h4zZLXyi4QVJ9CyhBhJ9ojjk8o3XsXrpprOTBC1Ek8thYtlvTHmq55t1D6vS1AYw"
// );

/*-------- Initialization --------*/
const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/**----------- Interceptor-------------- */

app.use((req: any, res: any, next: any) => {
  console.log("Request Received", req.originalUrl, req.method);
  next();
});

/**-------- Paths ------------------- */

app.use("/api/group/", Group);
app.use("/api/student/", Student);
app.use("/api/recruiter/", Recruiter);
app.use("/api/company/", Company);
app.use("/api/token/", Token);
app.use("/api/register/", Register);

/**-------- DB Connect ------------------- */
mongoose
  .connect(
    process.env.MONGO_CONNECTION_URL! // connecting mongoose to mongoDb
  )
  .then(() => console.log("Connection Established"));

const PORT = process.env.PORT || 8081;

app.use("/", (request: any, response: any) => {
  // response.sendFile(path.join(__dirname,"client","build","index.html"))
  response.send({ message: "Specified Path is not Defined" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
