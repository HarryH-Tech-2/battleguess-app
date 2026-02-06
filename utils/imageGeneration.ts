// Gemini API for image generation
const GEMINI_API_KEY = 'REDACTED_GEMINI_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent';

// Cache for generated images to avoid regenerating
const imageCache: Map<string, string> = new Map();

export interface BattleImageResult {
  imageUrl: string | null;
  error?: string;
}

/**
 * Generate a battle image using Gemini API
 * @param battleTitle - Title of the battle (e.g., "Battle of Thermopylae")
 * @param battleId - Unique ID for caching
 * @returns Promise with image URL or error
 */
export async function generateBattleImage(
  battleTitle: string,
  battleId: string
): Promise<BattleImageResult> {
  // Check cache first
  const cacheKey = `battle-${battleId}`;
  if (imageCache.has(cacheKey)) {
    return { imageUrl: imageCache.get(cacheKey)! };
  }

  try {
    const prompt = `Create a dramatic, historically-inspired illustration of the ${battleTitle}.
    Style: Epic historical painting style, dramatic lighting, no text or labels.
    Focus on the battle scene with soldiers, weapons, and landscape appropriate to the era.
    Make it visually striking and educational.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return { imageUrl: null, error: `API error: ${response.status}` };
    }

    const data = await response.json();

    // Extract image from response
    const candidates = data.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const base64Image = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          const imageUrl = `data:${mimeType};base64,${base64Image}`;

          // Cache the result
          imageCache.set(cacheKey, imageUrl);

          return { imageUrl };
        }
      }
    }

    return { imageUrl: null, error: 'No image in response' };
  } catch (error) {
    console.error('Error generating battle image:', error);
    return { imageUrl: null, error: String(error) };
  }
}

/**
 * Get a fallback image URL using picsum.photos
 * @param battleId - Battle ID for consistent seeding
 */
export function getFallbackImageUrl(battleId: string): string {
  const seed = battleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/400/300`;
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  imageCache.clear();
}
