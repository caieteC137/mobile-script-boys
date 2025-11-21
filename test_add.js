import './database/iniciarDatabase'; // Inicializa o banco automaticamente
import { addMuseu, getMuseus } from './database/iniciarDatabase';

export const popularBancoDados = () => {
  // Adicionar museus de teste
  const museusExemplo = [
    {
      nome: "MASP",
      localizacao: "São Paulo, SP",
      rating: 4.7,
      horarioFuncionamento: "10h-18h"
    },
    {
      nome: "Museu do Amanhã",
      localizacao: "Rio de Janeiro, RJ",
      rating: 4.8,
      horarioFuncionamento: "10h-17h"
    }
  ];

  museusExemplo.forEach(museu => addMuseu(museu));

  const todosMuseus = getMuseus();
  console.log('Museus cadastrados:', todosMuseus);
  
  return todosMuseus;
};