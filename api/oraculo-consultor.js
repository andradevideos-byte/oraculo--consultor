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

    // Chamada direta à API da OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: `
Você é o ORÁCULO CONSULTOR.
Fala com clareza, calma e elegância.
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

Faça uma leitura simbólica, moderna e prática,
com foco em orientação, clareza e autoconhecimento.
          `,
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("Erro OpenAI:", txt);
      return res
        .status(500)
        .json({ error: "Erro ao falar com a OpenAI.", detail: txt });
    }

    const data = await openaiRes.json();

    const interpretation = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ interpretation });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro interno no oráculo.", detail: err.message });
  }
}
