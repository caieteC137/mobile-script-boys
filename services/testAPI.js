const WIKI_API_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/Museu de Arte de São Paulo Assis Chateaubriand";

async function getWikipediaExtract() {
  try {
    const response = await fetch(WIKI_API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao buscar: ${response.status}`);
    }

    const data = await response.json();
    console.log("Extract:\n");
    console.log(data.extract); // Mostra apenas o resumo
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

getWikipediaExtract();

// TODO: Implementar a função de buscar o extract da Wikipedia junto com api Google: https://maps.googleapis.com/maps/api/place/textsearch/json?query=museums&key=AIzaSyDtPU6QBFbi6tPRq6mcFHURyNDGcsQ-Yuc