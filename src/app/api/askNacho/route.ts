import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getItem, MenuCategory, MenuItem } from '@/lib/data'; // Assuming getItem can fetch item details

interface AskNachoRequest {
  item: string;      // Exact item name or ""
  query: string;     // Free string; empty if only item was touched
  lang: "es" | "en"; // Language
}

// Ensure API key and base URL are set
const deepSeekApiKey = process.env.DEEPSEEK_API_KEY;
const deepSeekApiBase = process.env.DEEPSEEK_API_BASE;

if (!deepSeekApiKey) {
  console.warn("DEEPSEEK_API_KEY is not set. /api/askNacho will not work.");
}
if (!deepSeekApiBase) {
  console.warn("DEEPSEEK_API_BASE is not set. /api/askNacho will not work.");
}

const openai = new OpenAI({
  apiKey: deepSeekApiKey || "dummy-key", // SDK requires a key
  baseURL: deepSeekApiBase || "https://api.deepseek.com/v1", // Default if not set
});

function getRecipeText(itemName: string): string | null {
  if (!itemName) return null;
  // Need to iterate through categories to find the item, as getItem in data.ts needs category context
  // This is a simplification; ideally, getItem would search across all categories or seedMenu.json is restructured for easier lookup
  // For now, let's assume `seedMenu` is accessible here or we enhance `getItem`
  // This part needs to be implemented properly based on how `getItem` is designed or how data is structured for global item search.
  // Placeholder: 
  // const itemData = findItemByName(itemName); // You'll need a function like this in data.ts
  // return itemData ? itemData.recipe : null;
  
  // For the initial setup, let's assume we need to refine data access or that item names are unique
  // and we can find them. This is a mock, replace with actual data fetching.
  console.warn(`getRecipeText: Recipe fetching for '${itemName}' is not fully implemented yet. Using placeholder.`);
  // To make this runnable, we need a way to get a recipe. If item name is unique, we can search.
  // Let's use a mock recipe for now if we can't find it, for testing the LLM call.
  // This needs to be connected to the actual data loading from seedMenu.json
  const menu: MenuCategory[] = global.menuData; // This is a placeholder, data needs to be loaded correctly.
  if (menu) {
      for (const category of menu) {
          const foundItem = category.items.find(i => i.name === itemName);
          if (foundItem && foundItem.recipe) {
              return foundItem.recipe;
          }
      }
  }
  return `Recipe for ${itemName} not found in current mock.`;
}


export async function POST(request: Request) {
  if (!deepSeekApiKey || !deepSeekApiBase) {
    return NextResponse.json(
      { error: "API credentials for DeepSeek are not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json() as AskNachoRequest;
    const { item: itemName, query, lang } = body;

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

    let recipeText = "";
    if (itemName) {
        // Iterating through categories to find the item by name
        // This assumes item names are unique across categories or the first match is taken.
        // A more robust solution would involve passing category or having a global item map.
        const allMenuData = (await import('@/data/seedMenu.json')).default as MenuCategory[];
        let foundItem: MenuItem | undefined;
        for (const cat of allMenuData) {
            foundItem = cat.items.find(i => i.name === itemName);
            if (foundItem) break;
        }

        if (foundItem && foundItem.recipe) {
            recipeText = foundItem.recipe;
        } else if (itemName) { // If item was specified but not found or has no recipe
            // If the item is just a name (e.g., from GARNISH category) and has no recipe, recipeText remains empty.
            // If an item name was provided but not found at all, it's an issue.
            // For now, we allow recipeText to be empty if item has no recipe definition.
            if (!foundItem) {
                 console.warn(`Item "${itemName}" not found in seed data.`);
                 // Optionally, you could return a 404 or specific error here
            }
        }
    }

    let instruction = "";
    if (query) {
      instruction = query; // Use the direct query if provided
    } else if (itemName) {
      instruction = `Explica cómo preparar '${itemName}' con la receta siguiente:\n${recipeText}`;
    } else {
      // This case should ideally be caught by the earlier check (itemName || query)
      return NextResponse.json({ error: "No item or query provided." }, { status: 400 });
    }

    const systemPrompt = `Eres Nacho, coach culinario de Rreal Tacos. 
Responde breve, claro y en ${lang}.
Formato SIEMPRE:

### INGREDIENTES
- ...

### PASO A PASO
1. ...

### TIPS
- ...

No saludos ni disculpas. No hagas menciones a que eres una IA.

${query ? 'Responde a la siguiente pregunta sobre \'' + (itemName || 'el tema') + '\':' : ''}${query ? ('basándote (si es relevante y tienes la información) en esta receta: \n' + recipeText) : ''}`;

    // If there's a specific query, it overrides the default instruction generation
    // The system prompt now incorporates how to handle the query vs. base recipe explanation
    
    const userMessageContent = query ? query : instruction;

    const chatCompletion = await openai.chat.completions.create({
      model: "deepseek-chat", // Or the latest stable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessageContent }, // Content for user role changes based on query
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    const answer = chatCompletion.choices[0]?.message?.content || "No response from LLM.";

    return NextResponse.json({ answer });

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