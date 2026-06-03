const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `Olet ystävällinen tekoälymentori, joka auttaa ihmisiä muuttamaan unelmat todeksi teknologian ja tekoälyn avulla.

Käyttäjä kertoo nyt unelmansa. Tehtäväsi on:
1. Tunnista unelman ydin ja pilko se konkreettisiksi askeleiksi.
2. Listaa keskeiset taidot, joita unelman saavuttamiseen tarvitaan. Keskity erityisesti sellaisiin taitoihin, joita tekoäly voi joko opettaa, nopeuttaa tai automatisoida.
3. Kerro selkeästi ja käytännönläheisesti, **miten käyttäjä voi hyödyntää tekoälyä** juuri tämän unelman tavoittelussa. Anna konkreettisia esimerkkejä tekoälytyökaluista, automaatioista tai tavoista käyttää kielimalleja.

Vastaa aina tässä rakenteessa (käytä otsikoita):
**Unelman ymmärtäminen:** (lyhyt yhteenveto)
**Tarvittavat taidot:**
- Taito 1 (perustelu)
- Taito 2
...
**Kuinka tekoäly auttaa:**
- Tapa 1: ...
- Tapa 2: ...
**Konkreettinen oppimispolku:** 3-5 askeleen lista, miten edetä heti huomenna.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Vain POST sallittu.' });
  }

  const { dream } = req.body;
  if (!dream || dream.trim().length < 5) {
    return res.status(400).json({ error: 'Kirjoitathan unelmasi kunnolla.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${systemPrompt}\n\nKäyttäjän unelma: ${dream}`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ plan: text });
  } catch (error) {
    console.error("Gemini-virhe:", error);
    return res.status(500).json({ error: 'Tapahtui virhe. Kokeile hetken kuluttua uudelleen.' });
  }
}