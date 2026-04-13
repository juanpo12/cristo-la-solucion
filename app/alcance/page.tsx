"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, Baby, Shield, Activity, Users, 
  Music, Bus, Car, TreePine, Coffee, Flame, AlertCircle
} from "lucide-react"
import { submitAlcanceSignup } from "@/lib/actions/alcance"
import { useState } from "react"

export default function AlcancePage() {
  const serviceAreas = [
    "Hospital del Niño",
    "Policlínico Central",
    "Comisaría",
    "Policía Científica",
    "Bomberos Voluntarios",
    "Hogar de Niños",
    "Centro de Medicina Física y Rehabilitación",
    "Residencias de adultos mayores",
    "Choferes de colectivos",
    "Evangelización en semáforos",
    "Evangelización en plazas",
    "Personas en situación de calle"
  ]

  const serviceAreasData = [
    {
      title: "Hospital del Niño",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      task: "Llevar un juguete a los niños internados y a las familias un kit con provisiones.",
      notes: ["NO está permitido repartir golosinas o ningún otro alimento."]
    },
    {
      title: "Policlínico Central",
      icon: Baby,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      task: "Bendecir a las familias en la maternidad, llevando un kit de Recién Nacido (RN).",
      notes: ["NO está permitido repartir golosinas o ningún otro alimento."]
    },
    {
      title: "Comisaría y Policía Científica",
      icon: Shield,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      task: "Ser de bendición a los servidores públicos acercando una merienda a su destacamento.",
      notes: ["Entregaremos una tarjeta de gratitud y un presente."]
    },
    {
      title: "Bomberos Voluntarios",
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-100",
      task: "Ser de bendición acercando una merienda al cuartel de bomberos.",
      notes: ["Entregaremos una tarjeta de gratitud y un presente."]
    },
    {
      title: "Centro de Rehabilitación (CEMEFIR)",
      icon: Activity,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      task: "Llevar una propuesta artística (por ejemplo, una obra de teatro) para compartir.",
      notes: ["Entregaremos pochoclos, bebida y un muffin a cada participante."]
    },
    {
      title: "Institución Hogar de Niños",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      task: "Llevar una actividad deportiva para compartir con los niños alojados.",
      notes: [
        "NO preguntar a los niños por su historia personal o familia.",
        "NO tomar fotos ni subir a redes (solo equipo multimedia)."
      ]
    },
    {
      title: "Residencias de Adultos Mayores",
      icon: Music,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      task: "Llevar una propuesta musical alegre, folletos y compartir una merienda.",
      notes: ["Entregaremos un presente y una tarjeta con palabras de bendición."]
    },
    {
      title: "Choferes de Colectivo",
      icon: Bus,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      task: "Ser de bendición a los choferes que brindan un servicio público fundamental.",
      notes: ["Entregaremos una tarjeta de gratitud y un presente (Bon o Bon)."]
    },
    {
      title: "Autos en Semáforos",
      icon: Car,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      task: "Impactar visualmente con pancartas con mensajes positivos en cada luz roja.",
      notes: ["Entregaremos folletos con una bolsa de caramelos a los autos."]
    },
    {
      title: "Plazas",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-100",
      task: "Realizar una tarea evangelística en plazas, apoyada de actividades infantiles.",
      notes: ["Llevaremos globos, bolsas de caramelos, pochoclos y folletos."]
    },
    {
      title: "Situación de Calle",
      icon: Coffee,
      color: "text-stone-600",
      bgColor: "bg-stone-100",
      task: "Salir al encuentro de personas en situación vulnerable para brindar contención.",
      notes: ["Acercaremos un plato de comida caliente, ropa de abrigo y mantas."]
    }
  ]

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function clientAction(formData: FormData) {
    setLoading(true)
    setErrorMsg('')
    setSuccess(false)
    const res = await submitAlcanceSignup(formData)
    setLoading(false)
    if (res?.error) {
      setErrorMsg(res.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        {/* Banner Section */}
        <div className="w-full h-[400px] md:h-[500px] relative">
          <Image
            src="/DIA DE ALCANCE (2).jpeg"
            alt="Día de Alcance"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
              ¿Qué es el "Día de Alcance"?
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                El “Día de Alcance” es una iniciativa impulsada por esta iglesia, que busca movilizar a la iglesia hacia una expresión práctica de la fe, llevando el amor de Jesús a la comunidad de manera concreta. A través de una jornada organizada e intergeneracional, se invita a cada miembro a salir del templo para servir a las personas en distintos espacios de la ciudad, reflejando los valores del servicio, la empatía y el compromiso con el prójimo.
              </p>

              <p>
                Durante este día, se desarrollarán múltiples acciones en simultáneo —en hospitales, plazas, hogares, instituciones públicas y en la vía pública— con el objetivo de bendecir, acompañar y generar un impacto real en la vida de las personas. Cada actividad está pensada para responder a necesidades específicas, ofreciendo desde ayuda material hasta contención emocional y espiritual, fortaleciendo así el vínculo entre la iglesia y la comunidad, y mostrando el mensaje de salvación.
              </p>

              <p>
                En hospitales y centros de salud se entregarán kits para pacientes y familias, incluyendo juguetes para niños internados y elementos esenciales para recién nacidos, acompañados de mensajes de bendición. En comisarías, policía científica y cuarteles de bomberos se brindará una merienda junto con tarjetas de agradecimiento, reconociendo su servicio a la comunidad. También se realizarán intervenciones en centros de rehabilitación con actividades artísticas y recreativas para compartir tiempo de calidad con los asistentes.
              </p>

              <p>
                En hogares de niños y residencias de adultos mayores se desarrollarán propuestas recreativas, musicales y deportivas, generando espacios de encuentro, contención y alegría. En la vía pública, se entregarán folletos, mensajes positivos y pequeños obsequios a conductores y peatones, mientras que en plazas se llevarán adelante acciones de evangelismo y actividades para familias. Además, equipos recorrerán la ciudad asistiendo a personas en situación de calle con comida caliente, abrigo y acompañamiento, buscando generar un impacto directo y significativo en cada encuentro.
              </p>

              <p className="font-medium text-gray-900 mt-8">
                Estas tareas se realizan el lunes feriado 15 de Junio. Si queres ser parte de este proyecto, te invitamos a que llenes el siguiente formulario:
              </p>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lugares de Servicio y Tareas</h2>
              <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                Conocé de qué trata cada área, qué tareas vamos a estar realizando y encontrá tu lugar para servir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceAreasData.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <div key={idx} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-4 rounded-xl ${area.bgColor} ${area.color} flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {area.title}
                      </h3>
                    </div>
                    
                    <div className="flex-grow">
                      <p className="text-gray-700 font-medium mb-4">
                        {area.task}
                      </p>
                    </div>
                    
                    
                  </div>
                )
              })}
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100" id="inscripcion">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Formulario de Inscripción</h2>
              <p className="text-gray-600 mt-2">Completa tus datos para sumarte al Día de Alcance</p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">¡Inscripción Exitosa!</h3>
                <p>Tu formulario se ha enviado correctamente. Gracias por sumarte al Día de Alcance.</p>
              </div>
            ) : (
            <form action={clientAction} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>
                  <Input id="nombre" name="nombre" type="text" placeholder="Tu nombre completo" className="w-full" required />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <Input id="telefono" name="telefono" type="tel" placeholder="Tu número de celular" className="w-full" required />
                </div>

                <div>
                  <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                  <Input id="edad" name="edad" type="number" min="1" placeholder="Tu edad" className="w-full" required />
                </div>

                <div>
                  <label htmlFor="lider" className="block text-sm font-medium text-gray-700 mb-1">Nombre y apellido del líder</label>
                  <Input id="lider" name="lider" type="text" placeholder="Nombre de tu líder" className="w-full" required />
                </div>
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Área que te gustaría servir</label>
                <select
                  id="area"
                  name="area"
                  defaultValue=""
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>Seleccioná un área...</option>
                  {serviceAreas.map((area, index) => (
                    <option key={index} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium transition-colors">
                  {loading ? 'Enviando...' : 'Inscribirme al Día de Alcance'}
                </Button>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

