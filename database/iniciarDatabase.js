import * as SQLite from 'expo-sqlite';

// Abrir banco de dados
const db = SQLite.openDatabaseSync('museus.db');

// Inicializar banco e criar tabelas
const initDatabase = () => {
  try {
    // Tabela de museus
    db.execSync(`
      CREATE TABLE IF NOT EXISTS museus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        _id TEXT UNIQUE,
        nome TEXT NOT NULL,
        localizacao TEXT,
        rating REAL,
        horarioFuncionamento TEXT,
        favoritos TEXT,
        visitas TEXT,
        dataCriacao TEXT,
        dataAtualizacao TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        __v INTEGER DEFAULT 0
      );
    `);

    // Tabela de usuários
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        _id TEXT UNIQUE,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        profileImage TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
};

// ============ FUNÇÕES DE MUSEUS ============

// Adicionar museu
const addMuseu = (museu) => {
  try {
    const now = new Date().toISOString();
    const _id = museu._id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = db.runSync(
      `INSERT INTO museus (
        _id, nome, localizacao, rating, horarioFuncionamento,
        favoritos, visitas, dataCriacao, dataAtualizacao,
        createdAt, updatedAt, __v
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        _id,
        museu.nome,
        museu.localizacao || null,
        museu.rating || null,
        museu.horarioFuncionamento || null,
        JSON.stringify(museu.favoritos || []),
        JSON.stringify(museu.visitas || []),
        museu.dataCriacao || now,
        museu.dataAtualizacao || now,
        museu.createdAt || now,
        museu.updatedAt || now,
        museu.__v || 0
      ]
    );
    
    console.log('Museu adicionado:', result.lastInsertRowId);
    return { success: true, id: result.lastInsertRowId, _id };
  } catch (error) {
    console.error('Erro ao adicionar museu:', error);
    return { success: false, error: error.message };
  }
};

// Obter todos os museus
const getMuseus = () => {
  try {
    const rows = db.getAllSync('SELECT * FROM museus ORDER BY createdAt DESC');
    
    return rows.map(row => ({
      ...row,
      favoritos: JSON.parse(row.favoritos || '[]'),
      visitas: JSON.parse(row.visitas || '[]')
    }));
  } catch (error) {
    console.error('Erro ao buscar museus:', error);
    return [];
  }
};

// Obter museu por ID
const getMuseuById = (id) => {
  try {
    const row = db.getFirstSync(
      'SELECT * FROM museus WHERE id = ? OR _id = ?',
      [id, id]
    );
    
    if (!row) return null;
    
    return {
      ...row,
      favoritos: JSON.parse(row.favoritos || '[]'),
      visitas: JSON.parse(row.visitas || '[]')
    };
  } catch (error) {
    console.error('Erro ao buscar museu:', error);
    return null;
  }
};

// Deletar museu
const deleteMuseu = (id) => {
  try {
    const result = db.runSync(
      'DELETE FROM museus WHERE id = ? OR _id = ?',
      [id, id]
    );
    
    console.log('Museu deletado:', result.changes);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Erro ao deletar museu:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar museu
const updateMuseu = (id, camposAtualizados) => {
  try {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.keys(camposAtualizados).forEach(key => {
      if (key === 'favoritos' || key === 'visitas') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(camposAtualizados[key]));
      } else if (key !== 'id' && key !== '_id') {
        fields.push(`${key} = ?`);
        values.push(camposAtualizados[key]);
      }
    });
    
    fields.push('dataAtualizacao = ?', 'updatedAt = ?');
    values.push(now, now);
    values.push(id, id);
    
    const result = db.runSync(
      `UPDATE museus SET ${fields.join(', ')} WHERE id = ? OR _id = ?`,
      values
    );
    
    console.log('Museu atualizado:', result.changes);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Erro ao atualizar museu:', error);
    return { success: false, error: error.message };
  }
};

// ============ FUNÇÕES DE USUÁRIOS ============

// Adicionar usuário
const addUsuario = (usuario) => {
  try {
    const now = new Date().toISOString();
    const _id = usuario._id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = db.runSync(
      `INSERT INTO usuarios (_id, nome, email, password, profileImage, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        _id,
        usuario.nome,
        usuario.email,
        usuario.password || '',
        usuario.profileImage || null,
        usuario.createdAt || now
      ]
    );
    
    console.log('Usuário adicionado:', result.lastInsertRowId);
    return { success: true, id: result.lastInsertRowId, _id };
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    return { success: false, error: error.message };
  }
};

// Obter todos os usuários
const getUsuarios = () => {
  try {
    const rows = db.getAllSync('SELECT * FROM usuarios ORDER BY createdAt DESC');
    return rows;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

// Obter usuário por ID
const getUsuarioById = (id) => {
  try {
    const row = db.getFirstSync(
      'SELECT * FROM usuarios WHERE id = ? OR _id = ?',
      [id, id]
    );
    return row || null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

// Obter usuário por email
const getUsuarioByEmail = (email) => {
  try {
    const row = db.getFirstSync(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return row || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return null;
  }
};

// Atualizar usuário
const updateUsuario = (id, camposAtualizados) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(camposAtualizados).forEach(key => {
      if (key !== 'id' && key !== '_id' && key !== 'createdAt') {
        fields.push(`${key} = ?`);
        values.push(camposAtualizados[key]);
      }
    });
    
    values.push(id, id);
    
    const result = db.runSync(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ? OR _id = ?`,
      values
    );
    
    console.log('Usuário atualizado:', result.changes);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { success: false, error: error.message };
  }
};

// Deletar usuário
const deleteUsuario = (id) => {
  try {
    const result = db.runSync(
      'DELETE FROM usuarios WHERE id = ? OR _id = ?',
      [id, id]
    );
    
    console.log('Usuário deletado:', result.changes);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return { success: false, error: error.message };
  }
};

// ============ FUNÇÕES DE DEBUG ============

const debugDatabase = () => {
  try {
    const museus = getMuseus();
    const usuarios = getUsuarios();
    console.log('=== DEBUG DATABASE ===');
    console.log('Total de museus:', museus.length);
    console.log('Total de usuários:', usuarios.length);
    console.log('Museus:', JSON.stringify(museus, null, 2));
    console.log('Usuários:', JSON.stringify(usuarios, null, 2));
    return { museus, usuarios };
  } catch (error) {
    console.error('Erro no debug:', error);
  }
};

// Inicializar ao importar
initDatabase();

export {
  db,
  initDatabase,
  // Museus
  addMuseu,
  getMuseus,
  getMuseuById,
  deleteMuseu,
  updateMuseu,
  // Usuários
  addUsuario,
  getUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  updateUsuario,
  deleteUsuario,
  // Debug
  debugDatabase
};