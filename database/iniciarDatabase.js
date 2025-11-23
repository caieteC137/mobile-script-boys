import * as SQLite from 'expo-sqlite';

// Abrir banco de dados
const db = SQLite.openDatabaseSync('museus.db');

// Inicializar banco e criar tabela
const initDatabase = () => {
  try {
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
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
};

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
    
    // Construir query dinamicamente
    Object.keys(camposAtualizados).forEach(key => {
      if (key === 'favoritos' || key === 'visitas') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(camposAtualizados[key]));
      } else if (key !== 'id' && key !== '_id') {
        fields.push(`${key} = ?`);
        values.push(camposAtualizados[key]);
      }
    });
    
    // Atualizar dataAtualizacao e updatedAt
    fields.push('dataAtualizacao = ?', 'updatedAt = ?');
    values.push(now, now);
    
    // Adicionar ID ao final
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

// Função para debug - adicione ANTES do export
const debugDatabase = () => {
    try {
      const museus = getMuseus();
      console.log('=== DEBUG DATABASE ===');
      console.log('Total de museus:', museus.length);
      console.log('Dados:', JSON.stringify(museus, null, 2));
      return museus;
    } catch (error) {
      console.error('Erro no debug:', error);
    }
  };

// Inicializar ao importar
initDatabase();

export {
  db,
  initDatabase,
  addMuseu,
  getMuseus,
  getMuseuById,
  deleteMuseu,
  updateMuseu,
  debugDatabase
};