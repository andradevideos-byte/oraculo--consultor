import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Só aceitamos POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Use método POST com JSON { cards, question }" });
  }

  try {
    let body = req.body;

    if (!body) {
      return res
        .status(400)
        .json({ error: "Corpo vazio. Envie { cards, question }." });
    }

    // Se vier como string, converte pra objeto
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { cards, question } = body;

    if (!cards || !question) {
      return res
        .status(400)
        .json({ error: "Faltando 'cards' ou 'question' no corpo." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `
Você é o ORÁCULO CONSULTOR.
Você fala com clareza, calma e elegância.
Não prevê o futuro — interpreta símbolos e arquétipos.
Ajuda o usuário a tomar decisões conscientes.
Guia através de reflexão, não adivinhação.
          `,
        },
        {
          role: "user",
          content: `
As cartas escolhidas foram: ${cards.join(", ")}.
Pergunta do usuário: "${question}".

Faça uma leitura simbólica, moderna e prática.
Com foco em orientação, clareza e autoconhecimento.
          `,
        },
      ],
    });

    res.status(200).json({
      interpretation: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erro interno no oráculo.", detail: err.message });
  }
}
