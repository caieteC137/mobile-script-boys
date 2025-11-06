// utils/brazilianCities.js
// Lista de estados e principais cidades brasileiras com coordenadas

export const states = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
];

export const cities = {
  'AC': [
    { name: 'Rio Branco', latitude: -9.97499, longitude: -67.82431 },
  ],
  'AL': [
    { name: 'Maceió', latitude: -9.57131, longitude: -36.78195 },
  ],
  'AP': [
    { name: 'Macapá', latitude: 0.03493, longitude: -51.06944 },
  ],
  'AM': [
    { name: 'Manaus', latitude: -3.10194, longitude: -60.02500 },
  ],
  'BA': [
    { name: 'Salvador', latitude: -12.97111, longitude: -38.51083 },
    { name: 'Feira de Santana', latitude: -12.26667, longitude: -38.96667 },
  ],
  'CE': [
    { name: 'Fortaleza', latitude: -3.71722, longitude: -38.54333 },
  ],
  'DF': [
    { name: 'Brasília', latitude: -15.77972, longitude: -47.92972 },
  ],
  'ES': [
    { name: 'Vitória', latitude: -20.31944, longitude: -40.33778 },
  ],
  'GO': [
    { name: 'Goiânia', latitude: -16.67861, longitude: -49.25389 },
  ],
  'MA': [
    { name: 'São Luís', latitude: -2.52972, longitude: -44.30278 },
  ],
  'MT': [
    { name: 'Cuiabá', latitude: -15.59611, longitude: -56.09667 },
  ],
  'MS': [
    { name: 'Campo Grande', latitude: -20.44278, longitude: -54.64639 },
  ],
  'MG': [
    { name: 'Belo Horizonte', latitude: -19.91667, longitude: -43.93417 },
    { name: 'Uberlândia', latitude: -18.91861, longitude: -48.27722 },
  ],
  'PA': [
    { name: 'Belém', latitude: -1.45583, longitude: -48.50444 },
  ],
  'PB': [
    { name: 'João Pessoa', latitude: -7.11500, longitude: -34.86306 },
  ],
  'PR': [
    { name: 'Curitiba', latitude: -25.42778, longitude: -49.27306 },
    { name: 'Londrina', latitude: -23.31028, longitude: -51.16278 },
  ],
  'PE': [
    { name: 'Recife', latitude: -8.05389, longitude: -34.88111 },
  ],
  'PI': [
    { name: 'Teresina', latitude: -5.08917, longitude: -42.80194 },
  ],
  'RJ': [
    { name: 'Rio de Janeiro', latitude: -22.90694, longitude: -43.17278 },
    { name: 'Niterói', latitude: -22.88333, longitude: -43.10361 },
  ],
  'RN': [
    { name: 'Natal', latitude: -5.79500, longitude: -35.20944 },
  ],
  'RS': [
    { name: 'Porto Alegre', latitude: -30.03306, longitude: -51.23000 },
  ],
  'RO': [
    { name: 'Porto Velho', latitude: -8.76194, longitude: -63.90389 },
  ],
  'RR': [
    { name: 'Boa Vista', latitude: 2.81972, longitude: -60.67333 },
  ],
  'SC': [
    { name: 'Florianópolis', latitude: -27.59667, longitude: -48.54917 },
    { name: 'Joinville', latitude: -26.30444, longitude: -48.84556 },
  ],
  'SP': [
    { name: 'São Paulo', latitude: -23.55052, longitude: -46.633308 },
    { name: 'Campinas', latitude: -22.90556, longitude: -47.06083 },
    { name: 'Santos', latitude: -23.96083, longitude: -46.33306 },
    { name: 'Ribeirão Preto', latitude: -21.17750, longitude: -47.81028 },
  ],
  'SE': [
    { name: 'Aracaju', latitude: -10.91111, longitude: -37.07167 },
  ],
  'TO': [
    { name: 'Palmas', latitude: -10.16745, longitude: -48.32766 },
  ],
};

export const getDefaultLocation = () => {
  return {
    state: 'SP',
    city: 'São Paulo',
    latitude: -23.55052,
    longitude: -46.633308,
  };
};

export const getCitiesByState = (stateCode) => {
  return cities[stateCode] || [];
};

export const getCityCoordinates = (stateCode, cityName) => {
  const stateCities = cities[stateCode] || [];
  const city = stateCities.find(c => c.name === cityName);
  return city ? { latitude: city.latitude, longitude: city.longitude } : null;
};

