"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalendarDays, Clock } from "lucide-react"

export default function AgendaPage() {
  const agendaData = [
    {
      month: "MAYO 2026",
      events: [
        { day: "Viernes 1", title: "Reunión presencial Administración Financiera – Pr. Alfredo Dimiro", time: "19 hs" },
        { day: "Sábado 2", title: "Invictos Kids, Teens e Invictos especial Adm. Financiera", time: "19:30 hs" },
        { day: "Domingo 3", title: "Reunión (nuevo horario) – Administración Financiera", time: "11 y 18 hs" },
        { day: "Martes 5", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Jueves 7", title: "Reunión online especial de Adm. Financiera", time: "20:30 hs" },
        { day: "Sábado 9", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 10", title: "Domingo de Santa Cena", time: "11 y 18 hs" },
        { day: "Martes 12", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Jueves 14", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 16", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 17", title: "Reunión 11 y Unción con aceite", time: "11 y 18 hs" },
        { day: "Martes 19", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Jueves 21", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 23", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 24", title: "Reuniones Pentecostés", time: "11 y 18 hs" },
        { day: "Martes 26", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Jueves 28", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 30", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 31", title: "Reunión y Presentación de niños", time: "11 y 18 hs" },
      ]
    },
    {
      month: "JUNIO 2026",
      events: [
        { day: "Viernes 12", title: "Nosotras – Pastora Claudia Bunster", time: "19:30 hs" },
        { day: "Sábado 13", title: "Noche de adoración – Ap. Billy Bunster", time: "19:30 hs" },
        { day: "Domingo 14", title: "Reunión con normalidad y Ap. Billy Bunster", time: "11 y 18 hs" },
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
