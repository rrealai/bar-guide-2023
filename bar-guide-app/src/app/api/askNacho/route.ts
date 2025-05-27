import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import seedMenu from '@/data/seedMenu.json';

interface AskNachoRequest {
  item: string;
  query: string;
  lang: 'es' | 'en';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// Configuración de OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn("OPENAI_API_KEY is not set. /api/askNacho will not work.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey || "dummy-key",
});

// Función para encontrar un ítem en el JSON
function findItemByName(itemName: string) {
  for (const category of seedMenu) {
    const foundItem = category.items.find(item => 
      item.name.toLowerCase() === itemName.toLowerCase()
    );
    if (foundItem) {
      return { item: foundItem, category: category.category };
    }
  }
  return null;
}

export async function POST(request: Request) {
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: "API credentials for OpenAI are not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json() as AskNachoRequest;
    const { item: itemName, query, lang, history = [] } = body;

    if (!itemName && !query) {
      return NextResponse.json(
        { error: "Either 'item' or 'query' must be provided." },
        { status: 400 }
      );
    }

    if (!lang || !['es', 'en'].includes(lang)) {
      return NextResponse.json(
        { error: "Invalid or missing 'lang' parameter. Must be 'es' or 'en'." },
        { status: 400 }
      );
    }

    // Buscar el ítem en el JSON
    let itemData = null;
    let recipeText = "";
    
    if (itemName) {
      itemData = findItemByName(itemName);
      if (itemData) {
        recipeText = itemData.item.recipe || "";
      }
    }

    // Crear el prompt del sistema
    const systemPrompt = `Eres Nacho, coach culinario de Rreal Tacos. 
Responde breve, claro y en ${lang === 'es' ? 'español' : 'inglés'}.

FORMATO SIEMPRE:
### INGREDIENTES
- Lista de ingredientes

### PASO A PASO
1. Primer paso
2. Segundo paso
3. Etc.

### TIPS
- Consejos útiles

No saludos ni disculpas. No menciones que eres una IA. Sé conversacional y útil.

${itemData ? `Información del ítem "${itemName}" (categoría: ${itemData.category}):
Receta: ${recipeText}` : ''}`;

    // Determinar el mensaje del usuario
    let userMessage = "";
    if (query) {
      // Si hay una pregunta específica
      userMessage = query;
    } else if (itemName && itemData) {
      // Si es la primera vez que se abre el ítem, dar una explicación inicial
      userMessage = `Explícame cómo preparar ${itemName} de forma conversacional`;
    } else {
      userMessage = "Hola, ¿en qué puedo ayudarte?";
    }

    // Construir el historial de mensajes
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      { role: "user" as const, content: userMessage }
    ];

    // Llamar a OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = chatCompletion.choices[0]?.message?.content || "No pude generar una respuesta.";

    return NextResponse.json({ response });

  } catch (error) {
    console.error("Error in /api/askNacho:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to process request.", details: errorMessage },
      { status: 500 }
    );
  }
} 