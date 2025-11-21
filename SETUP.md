# 🚀 Guía de Instalación - CostaSuite API

## Requisitos Previos

- **Node.js** v18+ instalado
- **MongoDB** instalado y corriendo (local o remoto)
- **npm** o **yarn**

## 📋 Pasos de Instalación

### 1. Instalar Dependencias

```bash
cd rest-api
npm install
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está creado con valores por defecto. Si necesitas cambiar la URL de MongoDB o el puerto, edítalo:

```env
DATABASE_URL="mongodb://localhost:27017/costasuite"
PORT=3000
JWT_SECRET="costasuite-super-secret-jwt-key-2024"
```

### 3. Iniciar MongoDB

Asegúrate de que MongoDB esté corriendo:

**Windows:**
```bash
# Si instalaste MongoDB como servicio
net start MongoDB

# O ejecuta manualmente
mongod
```

**Mac/Linux:**
```bash
# Si usas Homebrew (Mac)
brew services start mongodb-community

# O ejecuta manualmente
mongod --config /usr/local/etc/mongod.conf
```

### 4. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

### 5. Sincronizar Schema con MongoDB

```bash
npm run prisma:push
```

### 6. Ejecutar Seed (Datos de Prueba)

```bash
npm run seed
```

Esto creará:
- **1 Admin:** `admin@costasuite.com` / `admin123`
- **2 Agentes:** `agent1@costasuite.com` y `agent2@costasuite.com` / `agent123`
- **5 Propiedades:** 2 en renta, 3 en venta

### 7. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 🧪 Verificar Instalación

### Health Check
```bash
curl http://localhost:3000/health
```

### Hacer Login (obtener token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@costasuite.com",
    "password": "admin123"
  }'
```

### Ver Propiedades (público, sin autenticación)
```bash
curl http://localhost:3000/api/properties
```

## 📦 Scripts Disponibles

- `npm run dev` - Iniciar en modo desarrollo (con hot reload)
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar en modo producción
- `npm run seed` - Ejecutar seed de datos
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:push` - Sincronizar schema con base de datos
- `npm run prisma:studio` - Abrir Prisma Studio (GUI para ver/editar datos)

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo
- Verifica la URL en `.env`
- Intenta conectarte manualmente: `mongosh`

### Error: "Module not found"
- Ejecuta: `npm install`
- Luego: `npm run prisma:generate`

### Error en Seed
- Limpia la base de datos y vuelve a ejecutar:
```bash
npm run prisma:push --force-reset
npm run seed
```

## 📚 Documentación de Endpoints

Ver `README.md` para la lista completa de endpoints disponibles.

## 🎉 ¡Listo!

Tu API de CostaSuite está funcionando. Puedes probarla con:
- **Postman** / **Insomnia** (importa la colección de endpoints)
- **Thunder Client** (extensión de VS Code)
- **curl** (línea de comandos)

---

**Nota:** Los errores de TypeScript en el IDE son normales hasta que ejecutes `npm install`. Una vez instaladas las dependencias, desaparecerán.
