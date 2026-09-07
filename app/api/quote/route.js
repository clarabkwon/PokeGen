function cleanFlavorText(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function generateAiQuote({ name, genus, personality }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Write one short first-person quote a Pokémon might say, based on its Pokédex personality. No quotation marks. Maximum 25 words.",
        },
        {
          role: "user",
          content: `Pokémon: ${name}. Kind: ${genus || "unknown"}. Pokédex notes: ${personality}`,
        },
      ],
      max_tokens: 80,
    }),
  });

  if (!response.ok) {
    console.error("OpenAI quote request failed", await response.text());
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name;
    const id = body?.id;

    if (!name && !id) {
      return Response.json({ error: "Missing Pokémon name or id" }, { status: 400 });
    }

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id || name}`,
    );
    if (!speciesResponse.ok) {
      return Response.json({ error: "Species not found" }, { status: 404 });
    }

    const species = await speciesResponse.json();
    const flavorTexts = (species.flavor_text_entries || [])
      .filter((entry) => entry.language?.name === "en")
      .map((entry) => cleanFlavorText(entry.flavor_text));
    const genus = species.genera?.find((entry) => entry.language?.name === "en")
      ?.genus;
    const personality = flavorTexts.slice(0, 3).join(" ");

    const aiQuote = await generateAiQuote({
      name,
      genus,
      personality,
    });
    if (aiQuote) {
      return Response.json({ quote: aiQuote, source: "ai" });
    }

    const fallbackQuote =
      flavorTexts[0] ||
      `${name} is a ${genus || "mysterious Pokémon"}.`;

    return Response.json({ quote: fallbackQuote, source: "pokedex" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not generate quote" }, { status: 500 });
  }
}
