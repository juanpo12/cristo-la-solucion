import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuración de Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
const isSandbox = accessToken.startsWith("TEST-");

const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
    idempotencyKey: "abc",
  },
});

export const preference = new Preference(client);

export interface CartItem {
  id: number;
  name: string;
  author: string;
  price: number;
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const preferenceData: unknown = {
      items: data.items.map((item) => ({
        id: item.id.toString(),
        title: item.name,
        description: `Libro por ${item.author}`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      })),
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
      preferenceData.payer = data.payer;
    }

    console.log(
      "Creating preference with data:",
      JSON.stringify(preferenceData, null, 2)
    );
    console.log("Is sandbox:", isSandbox);
    console.log("Base URL:", baseUrl);

    const response = await preference.create({ body: preferenceData });
    return response;
  } catch (error) {
    console.error("Error creating preference:", error);
    throw error;
  }
}
