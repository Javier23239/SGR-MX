const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10;
const SECRET_KEY = "SGR_MX_TOKEN_SECRET_2026"; 

// --- CONEXION BD ---
const dbConfig = {
  user          : "BASURA_DB",
  password      : "1234",
  connectString : "localhost:1521/XEPDB1" 
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. Inicia sesión." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Sesión expirada o inválida." });
    }
    req.user = decoded; 
    next();
  });
};

// ---  LOGIN  ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let usuarioDB = null;

    let resAdmin = await connection.execute(
      `SELECT CONTRASEÑA AS PASS, NOMBRE, 'ADMIN' AS ROL FROM BASURA_DB.ADMINISTRADOR WHERE UPPER(USUARIO) = UPPER(:email)`,
      { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (resAdmin.rows.length > 0) {
      usuarioDB = resAdmin.rows[0];
    } else {
      let resReco = await connection.execute(
        `SELECT PASSWORD AS PASS, NOMBRE, 'RECOLECTOR' AS ROL FROM BASURA_DB.RECOLECTOR WHERE UPPER(CORREO) = UPPER(:email)`,
        { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (resReco.rows.length > 0) {
        usuarioDB = resReco.rows[0];
      } else {
        let resCiu = await connection.execute(
          `SELECT PASSWORD AS PASS, NOMBRE, 'CIUDADANO' AS ROL FROM BASURA_DB.CIUDADANO WHERE UPPER(CORREO) = UPPER(:email)`,
          { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (resCiu.rows.length > 0) usuarioDB = resCiu.rows[0];
      }
    }

    if (usuarioDB) {
      const coinciden = await bcrypt.compare(password, usuarioDB.PASS);
      if (coinciden) {
        const token = jwt.sign(
          { nombre: usuarioDB.NOMBRE, email: email, rol: usuarioDB.ROL }, 
          SECRET_KEY, 
          { expiresIn: '4h' } 
        );
        res.json({ token, rol: usuarioDB.ROL, nombre: usuarioDB.NOMBRE });
      } else {
        res.status(401).json({ error: "Contraseña incorrecta" });
      }
    } else {
      res.status(401).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// ---  REGISTRO DE USUARIOS ---
app.post('/registrar-ciudadano', async (req, res) => {
  const { nombre, apellido, email, password, direccion, telefono, rol } = req.body; 
  let connection;
  try {
    const passwordHasheada = await bcrypt.hash(password || '1234', saltRounds);
    connection = await oracledb.getConnection(dbConfig);
    
    if (rol === "ADMIN") {
      await connection.execute(
        `INSERT INTO BASURA_DB.ADMINISTRADOR (NOMBRE, USUARIO, CONTRASEÑA) VALUES (:nombre, :usuario, :password)`,
        { nombre: `${nombre} ${apellido}`, usuario: email, password: passwordHasheada },
        { autoCommit: true }
      );
    } else if (rol === "RECOLECTOR") {
      await connection.execute(
        `INSERT INTO BASURA_DB.RECOLECTOR (NOMBRE, APELLIDO, TELEFONO, CORREO, PASSWORD) VALUES (:nombre, :apellido, :telefono, :email, :password)`,
        { nombre, apellido, telefono, email, password: passwordHasheada },
        { autoCommit: true }
      );
    } else {
      await connection.execute(
        `INSERT INTO BASURA_DB.CIUDADANO (NOMBRE, APELLIDO, CORREO, DIRECCION, TELEFONO, PASSWORD) VALUES (:nombre, :apellido, :email, :direccion, :telefono, :password)`,
        { nombre, apellido, email, direccion, telefono, password: passwordHasheada },
        { autoCommit: true }
      );
    }
    res.status(201).json({ mensaje: `Registro exitoso como ${rol}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- GESTION DE USUARIOS  ---
app.get('/usuarios', verificarToken, async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT ID_CIUDADANO AS ID, NOMBRE, APELLIDO, CORREO, DIRECCION, TELEFONO, 'CIUDADANO' AS ROL FROM BASURA_DB.CIUDADANO
      UNION ALL
      SELECT ID_RECOLECTOR AS ID, NOMBRE, APELLIDO, CORREO, 'N/A' AS DIRECCION, TELEFONO, 'RECOLECTOR' AS ROL FROM BASURA_DB.RECOLECTOR
      UNION ALL
      SELECT ID_ADMIN AS ID, NOMBRE, '' AS APELLIDO, USUARIO AS CORREO, 'N/A' AS DIRECCION, 'N/A' AS TELEFONO, 'ADMIN' AS ROL FROM BASURA_DB.ADMINISTRADOR
    `;
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- SOLICITUDES: CREAR Y VER ---
app.post('/solicitudes', verificarToken, async (req, res) => {
  const { descripcion, email, latitud, longitud } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      INSERT INTO BASURA_DB.SOLICITUD (DESCRIPCION, FECHA_SOLICITUD, ESTADO, ID_CIUDADANO, LATITUD, LONGITUD)
      VALUES (:descripcion, CURRENT_TIMESTAMP, 'Pendiente', 
        (SELECT ID_CIUDADANO FROM BASURA_DB.CIUDADANO WHERE UPPER(TRIM(CORREO)) = UPPER(TRIM(:email))),
        :latitud, :longitud)
    `;
    await connection.execute(sql, { descripcion, email, latitud, longitud }, { autoCommit: true });
    res.status(201).json({ mensaje: "Solicitud registrada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

app.get('/solicitudes/:email', verificarToken, async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.FECHA_SOLICITUD, S.ESTADO, S.LATITUD, S.LONGITUD, C.DIRECCION
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      WHERE UPPER(TRIM(C.CORREO)) = UPPER(TRIM(:email))
      ORDER BY S.FECHA_SOLICITUD DESC
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// ---  RECOLECTOR: TAREAS  ---
app.get('/recolector/mis-tareas/:email', verificarToken, async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.ESTADO, S.FECHA_SOLICITUD, S.LATITUD, S.LONGITUD, C.DIRECCION
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      JOIN BASURA_DB.RECOLECTOR R ON S.ID_RECOLECTOR = R.ID_RECOLECTOR
      WHERE UPPER(TRIM(R.CORREO)) = UPPER(TRIM(:email)) 
      AND S.ESTADO IN ('Asignado', 'En ruta')
      ORDER BY S.FECHA_SOLICITUD ASC
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- RECOLECTOR: HISTORIAL ---
app.get('/recolector/historial/:email', verificarToken, async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.ESTADO, S.FECHA_SOLICITUD, S.LATITUD, S.LONGITUD, C.DIRECCION
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      JOIN BASURA_DB.RECOLECTOR R ON S.ID_RECOLECTOR = R.ID_RECOLECTOR
      WHERE UPPER(TRIM(R.CORREO)) = UPPER(TRIM(:email)) 
      AND S.ESTADO = 'Completada'
      ORDER BY S.FECHA_SOLICITUD DESC
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- RECOLECTOR:  ESTADO ---
app.put('/recolector/actualizar-estado', verificarToken, async (req, res) => {
  const { id_solicitud, nuevo_estado } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE BASURA_DB.SOLICITUD SET ESTADO = :nuevo_estado WHERE ID_SOLICITUD = :id_solicitud`;
    await connection.execute(sql, { nuevo_estado, id_solicitud: Number(id_solicitud) }, { autoCommit: true });
    res.json({ mensaje: "Estado actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- ADMIN: REPORTES  ---
app.get('/admin/reportes', verificarToken, async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.ESTADO, S.FECHA_SOLICITUD, S.LATITUD, S.LONGITUD,
             C.NOMBRE || ' ' || C.APELLIDO AS CIUDADANO,
             R.NOMBRE || ' ' || R.APELLIDO AS CONDUCTOR
      FROM BASURA_DB.SOLICITUD S
      INNER JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      LEFT JOIN BASURA_DB.RECOLECTOR R ON S.ID_RECOLECTOR = R.ID_RECOLECTOR
      ORDER BY S.FECHA_SOLICITUD DESC
    `;
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- ADMIN: ASIGNACION ---
app.put('/admin/asignar-reporte', verificarToken, async (req, res) => {
  const { id_solicitud, id_recolector } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE BASURA_DB.SOLICITUD SET ID_RECOLECTOR = :id_recolector, ESTADO = 'Asignado' WHERE ID_SOLICITUD = :id_solicitud`;
    await connection.execute(sql, { id_recolector: Number(id_recolector), id_solicitud: Number(id_solicitud) }, { autoCommit: true });
    res.json({ mensaje: "Recolector asignado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// ---  ELIMINAR USUARIOS ---
app.delete('/usuarios/:id/:rol', verificarToken, async (req, res) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: "No tienes permisos de administrador." });
  }

  const { id, rol } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let table = rol === "ADMIN" ? "ADMINISTRADOR" : (rol === "RECOLECTOR" ? "RECOLECTOR" : "CIUDADANO");
    let pk = rol === "ADMIN" ? "ID_ADMIN" : (rol === "RECOLECTOR" ? "ID_RECOLECTOR" : "ID_CIUDADANO");
    
    const sql = `DELETE FROM BASURA_DB.${table} WHERE ${pk} = :id`;
    await connection.execute(sql, { id: Number(id) }, { autoCommit: true });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "No se puede eliminar: el usuario tiene datos vinculados." });
  } finally {
    if (connection) await connection.close();
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n SERVIDOR SGR-MX  ${PORT}`);
});