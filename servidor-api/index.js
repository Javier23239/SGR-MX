const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user          : "BASURA_DB",
  password      : "1234",
  connectString : "localhost:1521/XEPDB1" 
};

// --- 1. USUARIOS: OBTENER TODOS (PARA ADMIN) ---
app.get('/usuarios', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT ID_CIUDADANO AS ID, NOMBRE, APELLIDO, CORREO, DIRECCION, TELEFONO, 'VECINO' AS ROL FROM BASURA_DB.CIUDADANO
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

// --- 2. REGISTRO ---
app.post('/registrar-ciudadano', async (req, res) => {
  const { nombre, apellido, email, password, direccion, telefono, rol } = req.body; 
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    if (rol === "ADMIN") {
      await connection.execute(
        `INSERT INTO BASURA_DB.ADMINISTRADOR (NOMBRE, USUARIO, CONTRASEÑA) VALUES (:nombre, :usuario, :password)`,
        { nombre: `${nombre} ${apellido}`, usuario: email, password: password || 'admin123' },
        { autoCommit: true }
      );
    } else if (rol === "RECOLECTOR") {
      await connection.execute(
        `INSERT INTO BASURA_DB.RECOLECTOR (NOMBRE, APELLIDO, TELEFONO, CORREO, PASSWORD) VALUES (:nombre, :apellido, :telefono, :email, :password)`,
        { nombre, apellido, telefono, email, password: password || '1234' },
        { autoCommit: true }
      );
    } else {
      await connection.execute(
        `INSERT INTO BASURA_DB.CIUDADANO (NOMBRE, APELLIDO, CORREO, DIRECCION, TELEFONO, PASSWORD) VALUES (:nombre, :apellido, :email, :direccion, :telefono, :password)`,
        { nombre, apellido, email, direccion, telefono, password: password || '1234' },
        { autoCommit: true }
      );
    }
    res.status(201).json({ mensaje: `Registrado exitosamente como ${rol}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 3. LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result = await connection.execute(
      `SELECT 'ADMIN' AS ROL FROM BASURA_DB.ADMINISTRADOR WHERE UPPER(USUARIO) = UPPER(:email) AND CONTRASEÑA = :password`,
      { email, password }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      result = await connection.execute(
        `SELECT 'CONDUCTOR' AS ROL FROM BASURA_DB.RECOLECTOR WHERE UPPER(CORREO) = UPPER(:email) AND PASSWORD = :password`,
        { email, password }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }
    if (result.rows.length === 0) {
      result = await connection.execute(
        `SELECT 'CIUDADANO' AS ROL FROM BASURA_DB.CIUDADANO WHERE UPPER(CORREO) = UPPER(:email) AND PASSWORD = :password`,
        { email, password }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }
    
    if (result.rows.length > 0) {
      res.json({ rol: result.rows[0].ROL });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 4. SOLICITUDES: CIUDADANO ---
app.get('/solicitudes/:email', async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.FECHA_SOLICITUD, S.ESTADO 
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      WHERE UPPER(C.CORREO) = UPPER(:email)
      ORDER BY S.FECHA_SOLICITUD DESC
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    // Mapeo para normalizar llaves de Oracle a minúsculas para React
    const solicitudes = result.rows.map(row => ({
      id_solicitud: row.ID_SOLICITUD,
      descripcion: row.DESCRIPCION,
      fecha_solicitud: row.FECHA_SOLICITUD,
      estado: row.ESTADO
    }));
    
    res.json(solicitudes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 5. GESTIÓN: ADMINISTRADOR ---
app.get('/admin/reportes', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.ESTADO, S.FECHA_SOLICITUD,
             C.NOMBRE || ' ' || C.APELLIDO AS CIUDADANO,
             R.NOMBRE AS CONDUCTOR
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

app.put('/admin/asignar-reporte', async (req, res) => {
  const { id_solicitud, id_recolector } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE BASURA_DB.SOLICITUD SET ID_RECOLECTOR = :id_recolector, ESTADO = 'Asignado' WHERE ID_SOLICITUD = :id_solicitud`;
    await connection.execute(sql, { id_recolector, id_solicitud }, { autoCommit: true });
    res.json({ mensaje: "Asignado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 6. RECOLECTOR: OBTENER MIS TAREAS ---
app.get('/recolector/mis-tareas/:email', async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.ESTADO, S.FECHA_SOLICITUD, C.DIRECCION
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      JOIN BASURA_DB.RECOLECTOR R ON S.ID_RECOLECTOR = R.ID_RECOLECTOR
      WHERE UPPER(R.CORREO) = UPPER(:email) 
      AND S.ESTADO IN ('Asignado', 'En ruta')
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    // Mapeo crucial: Oracle (MAYÚSCULAS) -> Frontend (minúsculas)
    const tareas = result.rows.map(row => ({
      id: row.ID_SOLICITUD,
      tipo: "Recolección de Residuos",
      ubicacion: row.DIRECCION,
      descripcion: row.DESCRIPCION,
      estado: row.ESTADO,
      fecha: row.FECHA_SOLICITUD
    }));

    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 7. RECOLECTOR: ACTUALIZAR ESTADO ---
app.put('/recolector/actualizar-estado', async (req, res) => {
  const { id_solicitud, nuevo_estado } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE BASURA_DB.SOLICITUD SET ESTADO = :nuevo_estado WHERE ID_SOLICITUD = :id_solicitud`;
    await connection.execute(sql, { nuevo_estado, id_solicitud }, { autoCommit: true });
    res.json({ mensaje: "Estado actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 8. ELIMINAR USUARIO ---
app.delete('/usuarios/:id/:rol', async (req, res) => {
  const { id, rol } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let table = rol === "ADMIN" ? "ADMINISTRADOR" : (rol === "RECOLECTOR" ? "RECOLECTOR" : "CIUDADANO");
    let pk = rol === "ADMIN" ? "ID_ADMIN" : (rol === "RECOLECTOR" ? "ID_RECOLECTOR" : "ID_CIUDADANO");
    await connection.execute(`DELETE FROM BASURA_DB.${table} WHERE ${pk} = :id`, { id }, { autoCommit: true });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// --- 9. OBTENER HISTORIAL DE TAREAS COMPLETADAS ---
app.get('/recolector/historial/:email', async (req, res) => {
  const { email } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT S.ID_SOLICITUD, S.DESCRIPCION, S.FECHA_SOLICITUD, C.DIRECCION, S.ESTADO
      FROM BASURA_DB.SOLICITUD S
      JOIN BASURA_DB.CIUDADANO C ON S.ID_CIUDADANO = C.ID_CIUDADANO
      JOIN BASURA_DB.RECOLECTOR R ON S.ID_RECOLECTOR = R.ID_RECOLECTOR
      WHERE UPPER(R.CORREO) = UPPER(:email) 
      AND S.ESTADO = 'Completada'
      ORDER BY S.FECHA_SOLICITUD DESC
    `;
    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    // Mapeo crucial: Oracle (MAYÚSCULAS) -> Frontend (minúsculas)
    const historial = result.rows.map(row => ({
      id: row.ID_SOLICITUD,
      descripcion: row.DESCRIPCION,
      ubicacion: row.DIRECCION,
      fecha: row.FECHA_SOLICITUD,
      estado: row.ESTADO
    }));

    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n Servidor Backend Activo en http://localhost:${PORT}`);
});