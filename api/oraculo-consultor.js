import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { cards, question } = JSON.parse(req.body);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
    res.status(500).json({ error: err.message });
  }
}
