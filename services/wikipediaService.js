// services/wikipediaService.js

/**
 * Extrai o título da página do Wikipedia a partir de uma URL
 * @param {string} url - URL do Wikipedia (ex: https://pt.wikipedia.org/wiki/Museu_de_Arte_de_São_Paulo)
 * @returns {string|null} - Título da página ou null se inválido
 */
export function extractTitleFromWikipediaUrl(url) {
  try {
    // Remove espaços e quebras de linha
    url = url.trim();
    
    // Verifica se é uma URL válida do Wikipedia
    const wikipediaPattern = /wikipedia\.org\/wiki\/([^?#]+)/i;
    const match = url.match(wikipediaPattern);
    
    if (!match) {
      return null;
    }
    
    // Pega o título codificado da URL
    const encodedTitle = match[1];
    
    // Decodifica a URL (trata caracteres especiais como %C3%B3)
    let decodedTitle;
    try {
      decodedTitle = decodeURIComponent(encodedTitle);
    } catch (e) {
      // Se falhar, tenta decodificar com replace de _ por espaço
      decodedTitle = encodedTitle.replace(/_/g, ' ');
    }
    
    return decodedTitle;
  } catch (error) {
    console.error('Erro ao extrair título da URL:', error);
    return null;
  }
}

/**
 * Busca dados completos de um museu no Wikipedia a partir de uma URL
 * @param {string} wikipediaUrl - URL completa do artigo do Wikipedia
 * @returns {Promise<Object>} - Dados do museu formatados
 */
export async function fetchMuseumDataFromWikipedia(wikipediaUrl) {
  try {
    // Extrai o título da URL
    const pageTitle = extractTitleFromWikipediaUrl(wikipediaUrl);
    
    if (!pageTitle) {
      throw new Error('URL do Wikipedia inválida. Use uma URL como: https://pt.wikipedia.org/wiki/Nome_do_Museu');
    }

    console.log('Buscando Wikipedia para:', pageTitle);

    // Primeiro, tenta usar a API REST do Wikipedia (mais confiável)
    let fullData = null;
    let pageTitleForApi = pageTitle;
    
    // A API REST precisa do título com underscores, não espaços
    // Mas também aceita espaços, então vamos tentar ambos
    try {
      // Tenta com o título decodificado (pode ter espaços)
      const restUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
      const restRes = await fetch(restUrl);
      
      if (restRes.ok) {
        fullData = await restRes.json();
        pageTitleForApi = fullData.title || pageTitle;
        console.log('Dados encontrados via API REST');
      } else if (restRes.status === 404) {
        // Se não encontrar, tenta com underscores
        const titleWithUnderscores = pageTitle.replace(/\s+/g, '_');
        const restUrl2 = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleWithUnderscores)}`;
        const restRes2 = await fetch(restUrl2);
        if (restRes2.ok) {
          fullData = await restRes2.json();
          pageTitleForApi = fullData.title || pageTitle;
          console.log('Dados encontrados via API REST (com underscores)');
        }
      }
    } catch (e) {
      console.log('API REST não disponível, tentando API antiga:', e.message);
    }

    // Se a API REST não funcionou, usa a API antiga
    if (!fullData) {
      // Busca informações básicas da página usando a API antiga
      const searchUrl = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|coordinates|info&exintro=true&explaintext=true&titles=${encodeURIComponent(pageTitleForApi)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (!searchData.query || !searchData.query.pages) {
        throw new Error('Página não encontrada no Wikipedia. Verifique se a URL está correta.');
      }

      const pageId = Object.keys(searchData.query.pages)[0];
      const pageData = searchData.query.pages[pageId];

      if (pageId === '-1' || !pageData) {
        throw new Error('Página não encontrada no Wikipedia. Verifique se a URL está correta.');
      }

      // Prepara dados da API antiga
      fullData = {
        title: pageData.title || pageTitleForApi,
        extract: pageData.extract || '',
        thumbnail: pageData.thumbnail ? { source: pageData.thumbnail.source } : null,
        coordinates: pageData.coordinates?.[0] ? {
          lat: pageData.coordinates[0].lat,
          lon: pageData.coordinates[0].lon
        } : null,
      };
    }

    // Extrai informações
    const finalTitle = fullData.title || pageTitleForApi;
    const finalExtract = fullData.extract || '';
    const finalImage = fullData.thumbnail?.source || null;
    const finalCoordinates = fullData.coordinates || null;

    // Tenta extrair endereço do extract
    let address = '';
    if (finalExtract) {
      // Procura por padrões comuns de endereço
      const addressPatterns = [
        /(?:localizado|situado|localiza-se|fica|encontra-se)[^.]*?([A-Z][^.]*?(?:rua|avenida|praça|bairro|distrito|município|cidade|estado|país)[^.]*?)/i,
        /([A-Z][^.]*?(?:rua|avenida|praça)[^.]*?)/i,
        /([A-Z][^.]*?,\s*[A-Z][^.]*?)/,
      ];
      
      for (const pattern of addressPatterns) {
        const match = finalExtract.match(pattern);
        if (match && match[1]) {
          address = match[1].trim();
          break;
        }
      }
      
      // Se não encontrou endereço específico, tenta pegar a cidade mencionada
      if (!address) {
        const cityMatch = finalExtract.match(/(?:em|na|no|de)\s+([A-Z][a-záàâãéêíóôõúç]+(?:\s+[A-Z][a-záàâãéêíóôõúç]+)*)/);
        if (cityMatch && cityMatch[1]) {
          address = cityMatch[1];
        }
      }
    }

    // Formata os dados no formato esperado pelo app
    const museumData = {
      title: finalTitle,
      subtitle: address || finalTitle,
      formatted_address: address || 'Endereço não disponível',
      description: finalExtract.substring(0, 200) || 'Museu',
      rating: 4.5, // Padrão, pois não temos avaliação do Wikipedia
      user_ratings_total: 0,
      latitude: finalCoordinates?.lat || null,
      longitude: finalCoordinates?.lon || null,
      image: finalImage ? { uri: finalImage } : undefined,
      photos: finalImage ? [{ photo_reference: null, uri: finalImage }] : undefined,
      types: ['museum'], // Padrão
      opening_hours: {
        open_now: false, // Não temos essa informação do Wikipedia
      },
      wikipedia_url: wikipediaUrl,
      wikipedia_extract: finalExtract,
    };

    console.log('Museu criado com sucesso:', museumData.title);
    return museumData;
  } catch (error) {
    console.error('Erro ao buscar dados do Wikipedia:', error);
    throw error;
  }
}

export default {
  extractTitleFromWikipediaUrl,
  fetchMuseumDataFromWikipedia,
};

