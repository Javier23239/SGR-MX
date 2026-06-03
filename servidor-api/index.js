const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const saltRounds = 10;

// ======================================
// OTP TEMPORAL
// ======================================
const otpStorage = {};

// ======================================
// CONEXION ORACLE
// ======================================
const dbConfig = {

  user: "BASURA_DB",

  password: "1234",

  connectString: "localhost:1521/XEPDB1"

};

// ======================================
// GMAIL
// ======================================
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  }

});

// ======================================
// GENERAR OTP
// ======================================
function generarOTP() {

  return Math.floor(

    100000 + Math.random() * 900000

  ).toString();

}

// ======================================
// OBTENER USUARIOS
// ======================================
app.get("/usuarios", async (req, res) => {

  let connection;

  try {

    connection =
      await oracledb.getConnection(dbConfig);

    const sql = `

      SELECT 
        ID_CIUDADANO AS ID,
        NOMBRE,
        APELLIDO,
        CORREO,
        DIRECCION,
        TELEFONO,
        'CIUDADANO' AS ROL
      FROM BASURA_DB.CIUDADANO

      UNION ALL

      SELECT 
        ID_RECOLECTOR AS ID,
        NOMBRE,
        APELLIDO,
        CORREO,
        'N/A' AS DIRECCION,
        TELEFONO,
        'RECOLECTOR' AS ROL
      FROM BASURA_DB.RECOLECTOR

      UNION ALL

      SELECT 
        ID_ADMIN AS ID,
        NOMBRE,
        '' AS APELLIDO,
        USUARIO AS CORREO,
        'N/A' AS DIRECCION,
        'N/A' AS TELEFONO,
        'ADMIN' AS ROL
      FROM BASURA_DB.ADMINISTRADOR

    `;

    const result =
      await connection.execute(
        sql,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT
        }
      );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  } finally {

    if (connection)
      await connection.close();

  }

});

// ======================================
// REGISTRAR USUARIO
// ======================================
app.post("/registrar-ciudadano", async (req, res) => {

  const {
    nombre,
    apellido,
    email,
    password,
    direccion,
    telefono,
    rol
  } = req.body;

  let connection;

  try {

    const passParaEncriptar =
      password ||
      (rol === "ADMIN"
        ? "admin123"
        : "1234");

    const passwordHasheada =
      await bcrypt.hash(
        passParaEncriptar,
        saltRounds
      );

    connection =
      await oracledb.getConnection(dbConfig);

    // ======================================
    // ADMIN
    // ======================================
    if (rol === "ADMIN") {

      await connection.execute(

        `
        INSERT INTO BASURA_DB.ADMINISTRADOR
        (
          NOMBRE,
          USUARIO,
          CONTRASEÑA
        )
        VALUES
        (
          :nombre,
          :usuario,
          :password
        )
        `,

        {
          nombre:
            `${nombre} ${apellido}`,

          usuario: email,

          password:
            passwordHasheada
        },

        {
          autoCommit: true
        }

      );

    }

    // ======================================
    // RECOLECTOR
    // ======================================
    else if (rol === "RECOLECTOR") {

      await connection.execute(

        `
        INSERT INTO BASURA_DB.RECOLECTOR
        (
          NOMBRE,
          APELLIDO,
          TELEFONO,
          CORREO,
          PASSWORD
        )
        VALUES
        (
          :nombre,
          :apellido,
          :telefono,
          :email,
          :password
        )
        `,

        {
          nombre,
          apellido,
          telefono,
          email,
          password:
            passwordHasheada
        },

        {
          autoCommit: true
        }

      );

    }

    // ======================================
    // CIUDADANO
    // ======================================
    else {

      await connection.execute(

        `
        INSERT INTO BASURA_DB.CIUDADANO
        (
          NOMBRE,
          APELLIDO,
          CORREO,
          DIRECCION,
          TELEFONO,
          PASSWORD
        )
        VALUES
        (
          :nombre,
          :apellido,
          :email,
          :direccion,
          :telefono,
          :password
        )
        `,

        {
          nombre,
          apellido,
          email,
          direccion,
          telefono,
          password:
            passwordHasheada
        },

        {
          autoCommit: true
        }

      );

    }

    res.status(201).json({

      mensaje:
        `Registrado exitosamente como ${rol}`

    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  } finally {

    if (connection)
      await connection.close();

  }

});

// ======================================
// LOGIN
// ======================================
app.post("/login", async (req, res) => {

  // NORMALIZAR EMAIL
  const email =
    req.body.email
      .trim()
      .toLowerCase();

  const { password } = req.body;

  let connection;

  try {

    connection =
      await oracledb.getConnection(dbConfig);

    let usuarioDB = null;

    // ======================================
    // ADMIN
    // ======================================
    let resAdmin =
      await connection.execute(

        `
        SELECT
          CONTRASEÑA AS PASS,
          'ADMIN' AS ROL
        FROM BASURA_DB.ADMINISTRADOR
        WHERE LOWER(USUARIO) = :email
        `,

        { email },

        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT
        }

      );

    if (resAdmin.rows.length > 0) {

      usuarioDB =
        resAdmin.rows[0];

    }

    // ======================================
    // RECOLECTOR
    // ======================================
    else {

      let resReco =
        await connection.execute(

          `
          SELECT
            PASSWORD AS PASS,
            'RECOLECTOR' AS ROL
          FROM BASURA_DB.RECOLECTOR
          WHERE LOWER(CORREO) = :email
          `,

          { email },

          {
            outFormat:
              oracledb.OUT_FORMAT_OBJECT
          }

        );

      if (resReco.rows.length > 0) {

        usuarioDB =
          resReco.rows[0];

      }

      // ======================================
      // CIUDADANO
      // ======================================
      else {

        let resCiu =
          await connection.execute(

            `
            SELECT
              PASSWORD AS PASS,
              'CIUDADANO' AS ROL
            FROM BASURA_DB.CIUDADANO
            WHERE LOWER(CORREO) = :email
            `,

            { email },

            {
              outFormat:
                oracledb.OUT_FORMAT_OBJECT
            }

          );

        if (resCiu.rows.length > 0) {

          usuarioDB =
            resCiu.rows[0];

        }

      }

    }

    // ======================================
    // VALIDAR PASSWORD
    // ======================================
    if (usuarioDB) {

      const coinciden =
        await bcrypt.compare(
          password,
          usuarioDB.PASS
        );

      if (coinciden) {

        // ======================================
        // GENERAR OTP
        // ======================================
        const otp =
          generarOTP();

        // ======================================
        // GUARDAR OTP
        // ======================================
        otpStorage[email] = {

          otp,

          rol:
            usuarioDB.ROL

        };

        console.log(
          "OTP GENERADO:",
          otp
        );

        console.log(
          "OTP STORAGE:",
          otpStorage
        );

        // ======================================
        // ENVIAR CORREO
        // ======================================
        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to: email,

          subject:
            "Código de verificación SGR-MX",

          html: `

            <div style="font-family: Arial; padding:20px;">

              <h2>
                SGR-MX
              </h2>

              <p>
                Tu código de verificación es:
              </p>

              <h1 style="color: green;">

                ${otp}

              </h1>

              <p>
                No compartas este código.
              </p>

            </div>

          `

        });

        // ======================================
        // RESPUESTA
        // ======================================
        return res.json({

          requiresOTP: true,

          email

        });

      }

      return res.status(401).json({

        error:
          "Contraseña incorrecta"

      });

    }

    return res.status(401).json({

      error:
        "Usuario no encontrado"

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  } finally {

    if (connection)
      await connection.close();

  }

});

// ======================================
// VERIFICAR OTP
// ======================================
app.post("/verificar-otp", async (req, res) => {

  const email =
    req.body.email
      .trim()
      .toLowerCase();

  const { otp } = req.body;

  console.log(
    "EMAIL RECIBIDO:",
    email
  );

  console.log(
    "OTP RECIBIDO:",
    otp
  );

  console.log(
    "OTP STORAGE:",
    otpStorage
  );

  const registro =
    otpStorage[email];

  // ======================================
  // NO EXISTE
  // ======================================
  if (!registro) {

    return res.status(400).json({

      error:
        "OTP expirado"

    });

  }

  // ======================================
  // OTP CORRECTO
  // ======================================
  if (registro.otp === otp) {

    delete otpStorage[email];

    return res.json({

      success: true,

      rol: registro.rol

    });

  }

  // ======================================
  // OTP INCORRECTO
  // ======================================
  return res.status(401).json({

    error:
      "Código incorrecto"

  });

});

// ======================================
// PUERTO
// ======================================
const PORT = 5000;

app.listen(PORT, () => {

  console.log(

    `Servidor Backend Activo en http://localhost:${PORT}`

  );

});