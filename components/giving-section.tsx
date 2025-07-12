import { CreditCard, Smartphone, Building, Heart } from "lucide-react"

export default function GivingSection() {
  const givingMethods = [
    { icon: CreditCard, title: "Transferencia Bancaria", description: "CBU: 1234567890123456789012" },
    { icon: Smartphone, title: "Mercado Pago", description: "Alias: iglesia.cristo.solucion" },
    { icon: Building, title: "En Persona", description: "Durante los servicios" },
    { icon: Heart, title: "Donación Mensual", description: "Compromiso de apoyo continuo" },
  ]

  return (
    <section id="dar" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">FORMAS DE DAR</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu generosidad nos permite continuar con nuestra misión de transformar vidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">¿Por Qué Dar?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Apoyo a la Comunidad</h4>
                  <p className="text-gray-600">Ayudamos a familias necesitadas y proyectos sociales.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Crecimiento del Ministerio</h4>
                  <p className="text-gray-600">Expandimos nuestro alcance y programas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mantenimiento</h4>
                  <p className="text-gray-600">Cuidamos nuestras instalaciones y recursos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {givingMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="text-blue-600" size={20} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{method.title}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Cada Aporte Cuenta</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            No importa el monto, tu generosidad marca la diferencia en la vida de muchas personas.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Dar Ahora
          </button>
        </div>
      </div>
    </section>
  )
}
