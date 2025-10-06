# 🔧 Correcciones del AdminDashboard - Integración Backend-Frontend

## 📅 Fecha: 5 de Octubre 2025
## 🌿 Rama: `integracion-backend-frontend`

---

## 🐛 Problemas Identificados

### 1. **Incompatibilidad de Campos (number vs jersey_number)**
**Problema:** El frontend usaba `number` pero el modelo del backend usa `jersey_number`.

**Síntomas:**
- El botón "Actualizar" no funcionaba
- Los jugadores se creaban pero sin número de camiseta
- Validaciones de números duplicados fallaban

**Causa Raíz:**
```javascript
// ❌ ANTES (frontend enviaba):
{
  number: 10  // Campo que no existe en el modelo
}

// ✅ AHORA (frontend envía):
{
  jersey_number: 10  // Campo correcto del modelo
}
```

---

### 2. **Falta de `user_id` Requerido**
**Problema:** El modelo `Player` requiere `user_id` pero el frontend no lo enviaba.

**Síntomas:**
- Error 400 al crear jugadores
- Backend rechazaba las peticiones

**Solución:**
```javascript
const playerData = {
  name: playerForm.name,
  position: mapPositionToEnglish(playerForm.position),
  jersey_number: parseInt(playerForm.number),
  height: parseFloat(playerForm.height),
  weight: parseFloat(playerForm.weight),
  age: playerForm.age ? parseInt(playerForm.age) : undefined,
  user_id: user._id, // ✅ Agregado: ID del usuario admin logueado
  team: playerForm.team || undefined
};
```

---

### 3. **Posiciones en Español vs Inglés**
**Problema:** El frontend mostraba posiciones en español pero el modelo valida posiciones en inglés.

**Modelo Backend (validación enum):**
```javascript
position: {
  type: String,
  required: true,
  enum: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
}
```

**Solución - Mapeo Bidireccional:**

#### Español → Inglés (al enviar al backend)
```javascript
const mapPositionToEnglish = (position) => {
  const mapping = {
    'Base': 'Point Guard',
    'Escolta': 'Shooting Guard',
    'Alero': 'Small Forward',
    'Ala-Pívot': 'Power Forward',
    'Pívot': 'Center'
  };
  return mapping[position] || position;
};
```

#### Inglés → Español (al recibir del backend)
```javascript
const mapPositionToSpanish = (position) => {
  const mapping = {
    'Point Guard': 'Base',
    'Shooting Guard': 'Escolta',
    'Small Forward': 'Alero',
    'Power Forward': 'Ala-Pívot',
    'Center': 'Pívot'
  };
  return mapping[position] || position;
};
```

---

### 4. **Validación de Números Duplicados**
**Problema:** La validación usaba `player.number` en lugar de `player.jersey_number`.

**Antes:**
```javascript
// ❌ Campo incorrecto
const numberExists = players.some(p =>
  p.number === parseInt(number) && p._id !== editingItem?._id
);
```

**Ahora:**
```javascript
// ✅ Campo correcto
const numberExists = players.some(p =>
  p.jersey_number === parseInt(number) && p._id !== editingItem?._id
);
```

---

## ✅ Cambios Aplicados

### **Archivo: `frontend/src/pages/AdminDashboard.jsx`**

#### 1. **Función `handleCreatePlayer`**
```javascript
const handleCreatePlayer = async () => {
  if (!validatePlayerForm()) return;

  setLoading(true);
  try {
    const playerData = {
      name: playerForm.name,
      position: mapPositionToEnglish(playerForm.position), // ✅ Convertir a inglés
      jersey_number: parseInt(playerForm.number),          // ✅ Campo correcto
      height: parseFloat(playerForm.height),
      weight: parseFloat(playerForm.weight),
      age: playerForm.age ? parseInt(playerForm.age) : undefined,
      user_id: user._id,                                   // ✅ Agregar user_id
      team: playerForm.team || undefined
    };

    const response = await playersAPI.create(playerData);

    if (response.data.success) {
      toast.success('Jugador creado exitosamente');
      logAuditAction('CREATE_PLAYER', playerForm.name);
      setShowModal(false);
      resetPlayerForm();
      loadDashboardData();
    }
  } catch (error) {
    console.error('Error creating player:', error);
    toast.error(error.response?.data?.message || 'Error al crear jugador');
  } finally {
    setLoading(false);
  }
};
```

---

#### 2. **Función `handleUpdatePlayer`** (✅ Ahora funciona correctamente)
```javascript
const handleUpdatePlayer = async () => {
  if (!validatePlayerForm() || !editingItem) return;

  setLoading(true);
  try {
    const playerData = {
      name: playerForm.name,
      position: mapPositionToEnglish(playerForm.position), // ✅ Convertir a inglés
      jersey_number: parseInt(playerForm.number),          // ✅ Campo correcto
      height: parseFloat(playerForm.height),
      weight: parseFloat(playerForm.weight),
      age: playerForm.age ? parseInt(playerForm.age) : undefined,
      team: playerForm.team || undefined
    };

    const response = await playersAPI.update(editingItem._id, playerData);

    if (response.data.success) {
      toast.success('Jugador actualizado exitosamente');    // ✅ Toast de éxito
      logAuditAction('UPDATE_PLAYER', playerForm.name);
      setShowModal(false);
      resetPlayerForm();
      loadDashboardData();                                  // ✅ Recarga datos
    }
  } catch (error) {
    console.error('Error updating player:', error);
    toast.error(error.response?.data?.message || 'Error al actualizar jugador');
  } finally {
    setLoading(false);
  }
};
```

---

#### 3. **Función `openPlayerModal`**
```javascript
const openPlayerModal = (player = null) => {
  if (player) {
    setPlayerForm({
      name: player.name || '',
      position: mapPositionToSpanish(player.position) || '', // ✅ Convertir a español
      number: player.jersey_number?.toString() || '',        // ✅ Campo correcto
      height: player.height?.toString() || '',
      weight: player.weight?.toString() || '',
      age: player.age?.toString() || '',
      team: player.team || ''
    });
    setEditingItem(player);
  } else {
    resetPlayerForm();
  }
  setModalType('player');
  setShowModal(true);
};
```

---

#### 4. **Tabla de Jugadores (renderizado)**
```javascript
{players.map(player => (
  <tr key={player._id}>
    <td>{player.name}</td>
    <td>{mapPositionToSpanish(player.position)}</td>  {/* ✅ Convertir a español */}
    <td>#{player.jersey_number || 'N/A'}</td>        {/* ✅ Campo correcto */}
    <td>{player.height} cm</td>
    <td>{player.weight} kg</td>
    <td>
      <button className="btn-edit" onClick={() => openPlayerModal(player)}>
        ✏️ Editar
      </button>
      <button className="btn-delete" onClick={() => handleDeletePlayer(player)}>
        🗑️ Eliminar
      </button>
    </td>
  </tr>
))}
```

---

## 🧪 Casos de Prueba

### ✅ **Crear Jugador**
1. Ir a `/admin` → pestaña "Jugadores"
2. Clic en "➕ Agregar Jugador"
3. Completar:
   - Nombre: "Test Player"
   - Posición: "Base" (se enviará como "Point Guard")
   - Número: 10
   - Altura: 185
   - Peso: 80
4. Clic en "Crear"
5. **Resultado esperado:**
   - ✅ Toast de éxito
   - ✅ Jugador aparece en la tabla
   - ✅ Número se muestra como "#10"
   - ✅ Posición se muestra como "Base"

---

### ✅ **Editar Jugador (ANTERIORMENTE NO FUNCIONABA)**
1. Ir a `/admin` → pestaña "Jugadores"
2. Clic en "✏️ Editar" en un jugador
3. Modificar datos (ej. cambiar número de 10 a 23)
4. Clic en "Actualizar"
5. **Resultado esperado:**
   - ✅ Toast "Jugador actualizado exitosamente"
   - ✅ Modal se cierra
   - ✅ Cambios se reflejan en la tabla
   - ✅ Backend confirma actualización

---

### ✅ **Validación de Números Duplicados**
1. Intentar crear/editar un jugador con número ya existente
2. **Resultado esperado:**
   - ✅ Toast de error "Ya existe un jugador con ese número"
   - ✅ No se permite guardar

---

### ✅ **Conversión de Posiciones**
1. Crear jugador con posición "Ala-Pívot"
2. Backend recibe "Power Forward"
3. En tabla se muestra "Ala-Pívot"
4. Al editar, el select muestra "Ala-Pívot" correctamente

---

## 📊 Resumen de Correcciones

| Problema | Solución | Estado |
|----------|----------|--------|
| Botón "Actualizar" no funcionaba | Mapeo correcto de campos (jersey_number) | ✅ Corregido |
| Falta de `user_id` | Agregar `user._id` al crear jugadores | ✅ Corregido |
| Posiciones en inglés vs español | Mapeo bidireccional automático | ✅ Corregido |
| Validación de duplicados errónea | Usar `jersey_number` en validación | ✅ Corregido |
| Tabla mostraba datos incorrectos | Usar campos correctos del modelo | ✅ Corregido |

---

## 🚀 Próximos Pasos

1. **Validar manualmente** todas las funcionalidades del AdminDashboard
2. **Probar CRUD completo** de jugadores y usuarios
3. **Verificar manejo de errores** (401, 4xx, 5xx)
4. **Actualizar VALIDACION_INTEGRACION.md** con resultados

---

## 📝 Notas Técnicas

### **Modelo Backend (para referencia)**
```javascript
// backend/models/player.js
const playerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  position: {
    type: String,
    required: true,
    enum: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
  },
  height: { type: Number, required: true, min: 150, max: 230 },
  weight: { type: Number, required: true, min: 50, max: 150 },
  jersey_number: { type: Number, min: 1, max: 99 }, // ⚠️ Campo correcto
  age: { type: Number, min: 16, max: 50 },
  // ... otros campos
});
```

### **API Endpoints**
- `POST /api/v1/players` - Crear jugador (requiere auth)
- `PUT /api/v1/players/:id` - Actualizar jugador (requiere auth)
- `DELETE /api/v1/players/:id` - Eliminar jugador (requiere auth)
- `GET /api/v1/players` - Listar jugadores (público)
- `GET /api/v1/players/:id` - Obtener jugador (público)

---

**Última actualización:** 5 de Octubre 2025  
**Responsable:** GitHub Copilot + Jorge  
**Rama:** `integracion-backend-frontend`  
**Commit:** `7cda35f`
