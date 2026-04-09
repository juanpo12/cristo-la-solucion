"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalendarDays, Clock, MapPin } from "lucide-react"

export default function AgendaPage() {
  const agendaData = [
    {
      month: "ABRIL 2026",
      events: [
        { day: "Jueves 2", title: "Reunión Velorio cancelado – Pr. Simao", time: "19:30 hs" },
        { day: "Viernes 3", title: "Reunión Velorio cancelado – Pr. Simao", time: "19:30 hs" },
        { day: "Sábado 4", title: "Noche de Adoración – Velorio cancelado / Cultura Music", time: "19:30 hs" },
        { day: "Domingo 5", title: "Domingo de Resurrección con Santa Cena", time: "11 y 19 hs – Oración 10:15 y 18:15" },
        { day: "Martes 7", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Jueves 9", title: "Reunión online especial Velorio cancelado", time: "20:30 hs" },
        { day: "Sábado 11", title: "Arte CIs – Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 12", title: "Reunión presencial", time: "11 y 19 hs – Oración 10:15 y 18:15" },
        { day: "Martes 14", title: "Grupos de Conexión – Especial Alcance", time: "19:30 hs" },
        { day: "Jueves 16", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 18", title: "Actividad Teens / Arte CIs / Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 19", title: "Santa Cena", time: "11 y 19 hs – Oración 10:15 y 18:15" },
        { day: "Martes 21", title: "Grupos de Conexión (19:30 hs) – Nueva Creación (19 hs)", time: "" },
        { day: "Jueves 23", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 25", title: "Arte CIs / Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 26", title: "Reunión presencial", time: "11 y 19 hs – Oración 10:15 y 18:15" },
        { day: "Lunes 27", title: "Comienzo semana de Administración Financiera (Unánimes)", time: "22:30 hs" },
        { day: "Martes 28", title: "GDC especial Administración Financiera", time: "19:30 hs" },
        { day: "Miércoles 29", title: "Reunión presencial Administración Financiera – Pr. Daniel González", time: "19:30 hs" },
        { day: "Jueves 30", title: "Streaming especial con invitado – Administración Financiera", time: "20:30 hs" },
      ]
    },
    {
      month: "MAYO 2026",
      events: [
        { day: "Viernes 1", title: "Reunión presencial Administración Financiera – Pr. Alfredo Dimiro", time: "19:30 hs" },
        { day: "Sábado 2", title: "Arte CIs / Invictos Kids, Teens e Invictos especial Adm. Financiera", time: "19:30 hs" },
        { day: "Domingo 3", title: "Reunión (nuevo horario) – Administración Financiera", time: "11 y 18 hs – Oración 10:15 y 17:15" },
      ]
    },
    {
      month: "JUNIO 2026",
      events: [
        { day: "Lunes 15", title: "Día de Alcance", time: "Todo el día" },
      ]
    },
    {
      month: "AGOSTO 2026",
      events: [
        { day: "Dom. 16 y Lun. 17", title: "Inmersión", time: "" },
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
              <CalendarDays className="h-10 w-10 text-blue-600" />
              Nuestra Agenda
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mantente al tanto de todas nuestras próximas reuniones, eventos especiales y actividades de la iglesia a lo largo del año.
            </p>
          </div>

          <div className="space-y-12">
            {agendaData.map((monthData, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 border-b border-blue-950/20">
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    {monthData.month}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {monthData.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center hover:bg-slate-50 transition-colors">
                      <div className="md:w-1/4 mb-4 md:mb-0 flex-shrink-0">
                        <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg text-sm md:text-base border border-blue-200">
                          {event.day}
                        </span>
                      </div>
                      
                      <div className="md:w-3/4 md:pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {event.title}
                        </h3>
                        {event.time && (
                          <div className="flex items-center text-gray-600 font-medium">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            {event.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
