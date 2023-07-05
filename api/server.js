const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = "mysecretkey";

app.use(
  cors({
    origin: ["https://api.city-appliance.com", "http://45.132.241.52:8800"],
  })
);

app.use(express.static("public"));

app.use("/assets", express.static("assets"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mirzakhanazimi53@gmail.com",
    pass: "hhtcbtweoarvkalq",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

var mysqlConnection = mysql.createConnection({
  host: "153.92.6.122",
  // user: "elaminte_elaminte_content",
  // password: "h-&].emHSeQU",
  user: "u155750040_dalili",
  password: "UsKNNgPi2$",
  database: "u155750040_cityapplicance",
});

// ================= User Register ==========================
// Route for user registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let roles = req.body.roles;

  // If roles is a string, split it into an array
  if (typeof roles === "string") {
    roles = roles.split(",");
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert user into the database
  const userSql = "INSERT INTO users (email, password) VALUES (?, ?)";

  mysqlConnection.query(userSql, [email, hashedPassword], (err, userResult) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error registering user" });
      return;
    }

    const userId = userResult.insertId;

    // Insert each role as a separate row
    const roleSql = "INSERT INTO user_roles (user_id, role) VALUES ?";
    const roleValues = roles.map((role) => [userId, role.trim()]);

    mysqlConnection.query(roleSql, [roleValues], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering user" });
      } else {
        res.json({ message: "User registered successfully" });
      }
    });
  });
});

// ============ Login API Endpoint Apis =======================
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if user exists
  const sql = "SELECT * FROM users WHERE email = ?";

  mysqlConnection.query(sql, [email], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error logging in" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = results[0];

    // Check if password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token with user ID and roles
    const userId = user.id;
    const rolesSql = "SELECT role FROM user_roles WHERE user_id = ?";

    mysqlConnection.query(rolesSql, [userId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in" });
        return;
      }

      const roles = results.map((result) => result.role);

      const token = jwt.sign({ userId, roles }, secret);

      res.json({ token });
    });
  });
});

app.get("/users", (req, res) => {
  mysqlConnection.query("select * from users", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.delete("/users/:id", (req, res) => {
  const userID = req.params.id;
  console.log(userID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM users WHERE id = ?",
    [userID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.get("/roles", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  // Extract the token from the auth header
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    const sql = "SELECT role FROM user_roles WHERE user_id = ?";

    mysqlConnection.query(sql, [userId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error retrieving roles" });
        return;
      }

      const roles = results.map((result) => result.role);

      res.json({ roles });
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ============ Logo Endpoint Apis =======================
app.post("/logo", upload.single("image"), (req, res) => {
  // Get form data
  //const logoName = req.body.serviceName;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO logo SET ?",
    { image },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Logo added Successfully" });
      }
    }
  );
});

app.get("/logo", (req, res) => {
  mysqlConnection.query("select * from logo", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/UpdateLogo/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE logo SET";
  const values = [];
  if (req.file) {
    sql += " image=?,";
    values.push(req.file.path);
  }
  sql = sql.slice(0, -1); // Remove the trailing comma
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/logoById/:id", (req, res) => {
  const logoID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM logo WHERE id = ?",
    [logoID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        image: record.image,
      });
    }
  );
});

app.delete("/logo/:id", (req, res) => {
  const logoID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM logo WHERE id = ?",
    [logoID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});


// ============ FEATURES Image Endpoint Apis =======================
app.post("/featureImage", upload.single("image"), (req, res) => {
  // Get form data
  //const logoName = req.body.serviceName;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO featureImage SET ?",
    { image },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "featureImage added Successfully" });
      }
    }
  );
});

app.get("/featureImage", (req, res) => {
  mysqlConnection.query("select * from featureImage", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/featureImage/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE featureImage SET";
  const values = [];
  if (req.file) {
    sql += " image=?,";
    values.push(req.file.path);
  }
  sql = sql.slice(0, -1); // Remove the trailing comma
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});
app.get("/featureImageById/:id", (req, res) => {
  const featureImageID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM featureImage WHERE id = ?",
    [featureImageID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        image: record.image,
      });
    }
  );
});

app.delete("/featureImage/:id", (req, res) => {
  const featureImageID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM featureImage WHERE id = ?",
    [featureImageID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

// ============ Services Endpoint Apis =======================
app.post("/services", upload.single("image"), (req, res) => {
  // Get form data
  const serviceName = req.body.serviceName;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO repairandservices SET ?",
    { image, serviceName },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Services added successfully" });
      }
    }
  );
});

app.get("/services", (req, res) => {
  mysqlConnection.query("select * from repairandservices", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/services/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE repairandservices SET serviceName=?";
  const values = [req.body.serviceName];
  if (req.file) {
    sql += ", image=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});
app.get("/servicesById/:id", (req, res) => {
  const servicesID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM repairandservices WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.serviceName,
        image: record.image,
      });
    }
  );
});

app.delete("/services/:id", (req, res) => {
  const servicesID = req.params.id;
  console.log(servicesID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM repairandservices WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

// ============ Clients Endpoint Apis =======================

app.get("/clients", (req, res) => {
  mysqlConnection.query("select * from clients", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/clients/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE clients SET name=?, description=?";
  const values = [req.body.name, req.body.description];
  if (req.file) {
    sql += ", image=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/clientsById/:id", (req, res) => {
  const servicesID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM clients WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        name: record.name,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/clients/:id", (req, res) => {
  const servicesID = req.params.id;
  console.log(servicesID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM clients WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/clients", upload.single("image"), (req, res) => {
  // Get form data
  const name = req.body.name;
  const description = req.body.description;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO clients SET ?",
    { image, name, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Clients added successfully" });
      }
    }
  );
});

// ============ Google Map Endpoint Apis =======================

app.get("/googleMap", (req, res) => {
  mysqlConnection.query("select * from google_map", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.get("/googleMap", (req, res) => {
  mysqlConnection.query(
    "select * from google_map order by id desc limit 1",
    (err, data) => {
      if (err) console.log(err);
      else return res.json(data);
    }
  );
});

app.put("/googleMap/:id", (req, res) => {
  const sql = "UPDATE google_map SET contents=? WHERE id=?";
  const values = [req.body.googleMap];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/googleMapById/:id", (req, res) => {
  const servicesID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM google_map WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        contents: record.contents,
      });
    }
  );
});

app.delete("/googleMap/:id", (req, res) => {
  const servicesID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM google_map WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/googleMap", (req, res) => {
  // Get form data
  const contents = req.body.googleMap;
  mysqlConnection.query(
    "INSERT INTO google_map SET ?",
    { contents},
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Record added successfully" });
      }
    }
  );
});

// ==================================== Contact Us API ==============================

app.post("/contactUs", (req, res) => {
  const sql =
    "insert into contactus (`customerName`,`customerEmail`,`customerMessage`) values (?)";
  const values = [
    req.body.customerName,
    req.body.customerEmail,
    req.body.customerMessage,
  ];
  mysqlConnection.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/contactUs", (req, res) => {
  mysqlConnection.query("select * from contactus", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

// ============ Introduction Endpoint Apis =======================

app.get("/introduction", (req, res) => {
  mysqlConnection.query("select * from introduction", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/introduction/:id", (req, res) => {
  const sql = "UPDATE introduction SET isCurrent=?, videoLink=? WHERE id=?";
  const values = [req.body.isCurrent, req.body.videoLink];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/introductionById/:id", (req, res) => {
  const id = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM introduction WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        isCurrent: record.isCurrent,
        videoLink: record.videoLink,
      });
    }
  );
});

app.delete("/introduction/:id", (req, res) => {
  const sliderID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM introduction WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/introduction", (req, res) => {
  // Get form data
  const isCurrent = req.body.isCurrent;
  const videolink = req.body.videolink;

  mysqlConnection.query(
    "INSERT INTO introduction SET ?",
    { isCurrent, videolink },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ socialIcon Endpoint Apis =======================

app.get("/socialIcon", (req, res) => {
  mysqlConnection.query("select * from socialIcon", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/socialIcon/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE socialIcon SET name=?, link=?";
  const values = [req.body.name, req.body.link];
  if (req.file) {
    sql += ", icon=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/socialIconById/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM socialIcon WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        icon: record.icon,
        name: record.name,
        link: record.link,
      });
    }
  );
});

app.delete("/socialIcon/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM socialIcon WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/socialIcon",upload.single("image"), (req, res) => {
  // Get form data
  const icon = req.file.path;
  const name = req.body.name;
  const link = req.body.link;

  mysqlConnection.query(
    "INSERT INTO socialIcon SET ?",
    { icon, name, link },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ How We Help Endpoint Apis =======================

app.get("/howWeHelp", (req, res) => {
  mysqlConnection.query("select * from howwehelp", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/howWeHelp/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE howwehelp SET icon=?,title=?, description=?";
  const values = [req.body.icon,req.body.title, req.body.description];
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});
app.get("/howWeHelpById/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM howwehelp WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        icon: record.icon,
        title: record.title,
        description: record.description,
      });
    }
  );
});

app.delete("/howWeHelp/:id", (req, res) => {
  const sliderID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM howwehelp WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/howWeHelp", (req, res) => {
  // Get form data
  const title = req.body.title;
  const description = req.body.description;
  const icon = req.body.icon;

  mysqlConnection.query(
    "INSERT INTO howwehelp SET ?",
    { icon, title, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Hero Section Endpoint Apis =======================

app.get("/hero", (req, res) => {
  mysqlConnection.query("select * from hero", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/hero/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE hero SET main_title=?, sub_title=?, phone_no=?";
  const values = [
    req.body.main_title,
    req.body.sub_title,
    req.body.phone_no,
  ];
  if (req.file) {
    sql += ", image=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/heroById/:id", (req, res) => {
  const heroID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM hero WHERE id = ?",
    [heroID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        main_title: record.main_title,
        sub_title: record.sub_title,
        phone_no: record.phone_no,
        image: record.image,
      });
    }
  );
});

app.delete("/hero/:id", (req, res) => {
  const heroID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM hero WHERE id = ?",
    [heroID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/hero", upload.single("image"), (req, res) => {
  // Get form data
  const main_title = req.body.main_title;
  const sub_title = req.body.sub_title;
  const phone_no = req.body.phone_no;
  const image = req.file.path;
  mysqlConnection.query(
    "INSERT INTO hero SET ?",
    { main_title, sub_title, phone_no, image },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Data added successfully" });
      }
    }
  );
});
// ============ Short About Us Endpoint Apis =======================

app.get("/shortAboutUs", (req, res) => {
  mysqlConnection.query("select * from shortaboutus", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/shortAboutUs/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE shortaboutus SET title=?, description=?";
  const values = [
    req.body.title,
    req.body.description,
  ];
  if (req.file) {
    sql += ", image=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/shortAboutUsById/:id", (req, res) => { 
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM shortaboutus WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.title,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/shortAboutUs/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM shortaboutus WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/shortAboutUs", upload.single("image"), (req, res) => {
  // Get form data
  const title = req.body.title;
  const description = req.body.description;
  const image = req.file.path;
  console.log(image);
  mysqlConnection.query(
    "INSERT INTO shortaboutus SET ?",
    { title, description, image },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Our Contacts Endpoint Apis =======================

app.get("/ourContact", (req, res) => {
  mysqlConnection.query("select * from ourcontact", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/ourContact/:id", (req, res) => {
  const sql = "UPDATE ourcontact SET phone=?, address=?,email=? WHERE id=?";
  const values = [req.body.phone, req.body.address, req.body.email];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/ourContactById/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM ourcontact WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        phone: record.phone,
        address: record.address,
        email: record.email,
      });
    }
  );
});

app.delete("/ourContact/:id", (req, res) => {
  const sliderID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM ourcontact WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/ourContact", (req, res) => {
  // Get form data
  const phone = req.body.phone;
  const address = req.body.address;
  const email = req.body.email;

  mysqlConnection.query(
    "INSERT INTO ourcontact SET ?",
    { phone, address, email },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Footer Endpoint Apis =======================

app.get("/getFooter", (req, res) => {
  mysqlConnection.query("select * from footer", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.get("/getFooterRec", (req, res) => {
  mysqlConnection.query(
    "select * from footer order by id desc limit 1",
    (err, data) => {
      if (err) console.log(err);
      else return res.json(data);
    }
  );
});

app.put("/updateFooter/:id", (req, res) => {
  console.log(req.params.id);
  const sql =
    "UPDATE team SET company=?, address=?, email=?, phone=?,description=? WHERE id=?";
  const values = [
    req.body.company,
    req.body.address,
    req.body.email,
    req.body.phone,
    req.body.description,
  ];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getFooterId/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM footer WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        company: record.company,
        address: record.address,
        email: record.email,
        phone: record.phone,
        phone: record.description,
      });
    }
  );
});

app.delete("/deleteFooter/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM footer WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/footer", (req, res) => {
  // Get form data
  const company = req.body.company;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;
  const description = req.body.description;

  mysqlConnection.query(
    "INSERT INTO footer SET ?",
    { company, address, email, phone, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ TESTIMONIAL Section Endpoint Apis =======================

app.get("/review", (req, res) => {
  mysqlConnection.query("select * from review", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/review/:id", upload.single("image"), (req, res) => {
  let sql = "UPDATE review SET userName=?, rating=?, description=?";
  const values = [
    req.body.userName,
    req.body.rating,
    req.body.description,
  ];
  if (req.file) {
    sql += ", image=?";
    values.push(req.file.path);
  }
  sql += " WHERE id=?";
  values.push(req.params.id);
  mysqlConnection.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/review/:id", (req, res) => {
  const reviewID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM review WHERE id = ?",
    [reviewID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        userName: record.userName,
        image: record.sub_title,
        rating: record.rating,
        description: record.description,
      });
    }
  );
});

app.delete("/review/:id", (req, res) => {
  const reviewID = req.params.id;
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM review WHERE id = ?",
    [reviewID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/review", upload.single("image"), (req, res) => {
  // Get form data
  const userName = req.body.userName;
  const image = req.file.path;
  const rating = req.body.rating;
  const description = req.body.description;
  mysqlConnection.query(
    "INSERT INTO review SET ?",
    { userName,image, rating,description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Data added successfully" });
      }
    }
  );
});


// ========================== schedule Service Post =====================

app.post("/scheduleService", (req, res) => {
  // Get form data
  let ProblemType;
  console.log(req.body);
  const serviceId = req.body.product;
  if (typeof req.body.product_dishwasher !== 'undefined' && req.body.product_dishwasher !== '') 
  {
    if(req.body.product_dishwasher !== 'Other'){
      
      ProblemType = req.body.product_dishwasher;

    }else{
      ProblemType = req.body.other_problem_dishwasher;
    }
  } 
  
  else if (typeof req.body.product_dryer !== 'undefined' && req.body.product_dryer !== '') 
  {
    if(req.body.product_dryer !== 'Other'){
      
      ProblemType = req.body.product_dryer;
      
    } else {
      ProblemType = req.body.other_problem_dryer;
    }
  } 
  else if (typeof req.body.product_freezer !== 'undefined' && req.body.product_freezer !== '') 
  {
    if(req.body.product_freezer !== 'Other'){
      
      ProblemType = req.body.product_freezer;
      
    } else {
      ProblemType = req.body.other_problem_freezer;
    }

  } 
  
  else if (typeof req.body.product_microwave !== 'undefined' && req.body.product_microwave !== '') 
  {
    if(req.body.product_microwave !== 'Other'){
      
      ProblemType = req.body.product_microwave;
      
    } else {
      ProblemType = req.body.other_problem_microwave;
    }
  }
  
  else if (typeof req.body.product_range !== 'undefined' && req.body.product_range !== '')
  {
    if(req.body.product_range !== 'Other'){
      
      ProblemType = req.body.product_range;
      
    } else {
      ProblemType = req.body.other_problem_range;
    }
  } 
  
  else if (typeof req.body.product_walloven !== 'undefined' && req.body.product_walloven !== '') 
  {
    if(req.body.product_walloven !== 'Other'){
      
      ProblemType = req.body.product_walloven;
      
    } else {
      ProblemType = req.body.other_problem_walloven;
    }
  } 
  
  else if (typeof req.body.product_refrigerator !== 'undefined' && req.body.product_refrigerator !== '') 
  {
    if(req.body.product_refrigerator !== 'Other'){
      
      ProblemType = req.body.product_refrigerator;
      
    } else {
      ProblemType = req.body.other_problem_refrigerator;
    }
  } 
  
  else if (typeof req.body.problem_Trash_Compactor !== 'undefined' && req.body.problem_Trash_Compactor !== '')
 {
  if(req.body.problem_Trash_Compactor !== 'Other'){
      
    ProblemType = req.body.problem_Trash_Compactor;
    
  } else {
    ProblemType = req.body.other_problem_Trash_Compactor;
  }

  }
  
  else if (typeof req.body.problem_washer !== 'undefined' && req.body.problem_washer !== '') 
  {
    if(req.body.problem_washer !== 'Other'){
      
    ProblemType = req.body.problem_washer;
    
  } else {
    ProblemType = req.body.other_problem_washer;
  }
  } 
  
  else if (typeof req.body.problem_garbage_disposal !== 'undefined' && req.body.problem_garbage_disposal !== '') 
  {
    if(req.body.problem_garbage_disposal !== 'Other'){
      
      ProblemType = req.body.problem_garbage_disposal;
      
    } else {
      ProblemType = req.body.other_problem_garbage_disposal;
    }
  }
  
else if (typeof req.body.problem_range_hood !== 'undefined' && req.body.problem_range_hood !== '')
 {
  if(req.body.problem_range_hood !== 'Other'){
      
    ProblemType = req.body.problem_range_hood;
    
  } else {
    ProblemType = req.body.other_problem_range_hood;
  }
  }

  else if (typeof req.body.product_cooktop !== 'undefined' && req.body.product_cooktop !== '')
 {
  if(req.body.product_cooktop !== 'Other'){
      
    ProblemType = req.body.product_cooktop;
    
  } else {
    ProblemType = req.body.other_problem_cooktop;
  }
  }
  const clientId = req.body.clientId;
  const ModelNumber = req.body.ModelNumber;
  const SerialNumber = req.body.SerialNumber;
  const clientName = req.body.clientName;
  const email = req.body.customer_email;
  const phoneNumber = req.body.phoneNumber;
  const numberType = req.body.numberType;
  const secondaryPhone = req.body.secondaryPhone;
  const streetNumberName = req.body.streetNumberName;
  const state = req.body.state;
  const city = req.body.city;
  const zipCode = req.body.zipcode;
  const time_reserve = req.body.times_reserve;
  const unit_number = req.body.unit_number;
  mysqlConnection.query(
    "INSERT INTO scheduleservice SET ?",
    {
      serviceId,
      ProblemType,
      clientId,
      ModelNumber,
      SerialNumber,
      clientName,
      email,
      phoneNumber,
      numberType,
      secondaryPhone,
      streetNumberName,
      state,
      city,
      zipCode,
      time_reserve,
      unit_number,
    },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        // Compose email message
        const mailOptions = {
          from: "mirzakhanazimi53@gmail.com",
          to: `${email}`,
          subject: "New Service Request",
          html: `
      <p>Service Name: ${serviceId}</p>
      <p>Problem Type: ${ProblemType}</p>
      <p>Brand: ${clientId}</p>
      <p>Model Number: ${ModelNumber}</p>
      <p>Serial Number: ${SerialNumber}</p>
      <p>Client Name: ${clientName}</p>
      <p>Email: ${email}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <p>Number Type: ${numberType}</p>
      <p>Secondary Phone: ${secondaryPhone}</p>
      <p>Street Number and Name: ${streetNumberName}</p>
      <p>State: ${state}</p>
      <p>City: ${city}</p>
      <p>Zip Code: ${zipCode}</p>
      <p>Time Reserve: ${time_reserve}</p>
      <p>Unit Number: ${unit_number}</p>
    `,
        };
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.sendStatus(500);
          } else {
            console.log("Email sent: " + info.response);
            res.json({
              message:
                "Your request has been submitted. You will shortly receive an email!",
            });
          }
        });
      }
    }
  );
});
app.listen(8800, () => {
  console.log("listening");
});
