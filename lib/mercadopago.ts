import { MercadoPagoConfig, Preference } from "mercadopago";
import { randomUUID } from "crypto";
import { env } from "@/lib/env";

// Configuración de Mercado Pago
const accessToken = env.MERCADOPAGO_ACCESS_TOKEN;

const isSandbox = accessToken.startsWith("TEST-");

const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

export const preference = new Preference(client);

export interface CartItem {
  id: number | string; // Allow string for compatibility
  name: string;
  title?: string; // Optional for compatibility
  author: string;
  price: number;
  unit_price?: number; // Optional for compatibility
  image: string;
  quantity: number;
}

export interface CreatePreferenceData {
  items: CartItem[];
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
  };
}

export async function createPreference(data: CreatePreferenceData) {
  try {
    const baseUrl = env.NEXT_PUBLIC_BASE_URL;
    const idempotencyKey = randomUUID();

    const preferenceData: unknown = {
      items: data.items.map((item) => ({
        id: item.id.toString(),
        title: item.name,
        description: `Libro por ${item.author}`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      })),
      shipments: {
        mode: "me2", // 🚀 activa Mercado Envíos
        local_pickup: true, // opcional: permitir "retiro en el local"
        dimensions: "30x30x30,500",
      },
      back_urls: {
        success: `${baseUrl}/tienda/success`,
        failure: `${baseUrl}/tienda/failure`,
        pending: `${baseUrl}/tienda/pending`,
      },
      auto_return: "approved",
      statement_descriptor: "Cristo la Solucion",
      external_reference: `order_${Date.now()}`,
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      expires: false,
      binary_mode: false,
    };

    // Solo agregar payer si se proporciona
    if (data.payer && (data.payer.email || data.payer.name)) {
      (preferenceData as { payer?: CreatePreferenceData["payer"] }).payer =
        data.payer;
    }

    console.log(
      "Creating preference with data:",
      JSON.stringify(preferenceData, null, 2)
    );
    console.log("Is sandbox:", isSandbox);
    console.log("Base URL:", baseUrl);

    const response = await preference.create({
      body: preferenceData as any,
      requestOptions: { idempotencyKey },
    });
    return response;
  } catch (error) {
    console.error("Error creating preference:", error);
    throw error;
  }
}
