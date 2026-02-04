import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Videos y Mensajes | Cristo la Solución",
    description: "Revive nuestras reuniones y mensajes. Predicaciones que edificarán tu vida.",
}

export default function VideosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
