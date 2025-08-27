-- Crear tabla de contactos/peticiones
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Agregar comentarios para documentación
COMMENT ON TABLE contacts IS 'Tabla para almacenar contactos y peticiones del sitio web';
COMMENT ON COLUMN contacts.type IS 'Tipo de petición: general, prayer, pastoral, group';
COMMENT ON COLUMN contacts.status IS 'Estado de la petición: pending, read, responded, closed';