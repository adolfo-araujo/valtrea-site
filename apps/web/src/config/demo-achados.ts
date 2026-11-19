export interface Find {
  id: string;
  name: string;
  short: string;
  text: string;
  price: number;
  tint: string;
  art: string;
  points: string[];
}

export const finds: Find[] = [
  { id: "mordedor", art: "art-madeira", name: "Mordedor de madeira para cães", short: "Mordedor", text: "Madeira natural que não lasca. Distrai o cão e salva o pé da mesa.", price: 69.9, tint: "#b98654", points: ["Madeira de café, sem verniz", "Três tamanhos", "Dura meses"] },
  { id: "coletor", art: "art-coletor", name: "Coletor de fiapos para máquina (2 un.)", short: "Coletor", text: "Vai na máquina junto com a roupa e segura o pelo e o fiapo.", price: 39.9, tint: "#7aa7c7", points: ["Reutilizável", "Serve em qualquer máquina", "Kit com 2"] },
  { id: "luva", art: "art-luva", name: "Luva removedora de pelos", short: "Luva", text: "Tira o pelo solto enquanto faz carinho. Funciona em cão e gato.", price: 49.9, tint: "#8fb36a", points: ["Silicone macio", "Lava em água corrente", "Tamanho único"] },
  { id: "rolo", art: "art-rolo", name: "Rolo tira-pelos reutilizável", short: "Rolo", text: "Sem refil: passa no sofá, abre, joga o pelo fora e pronto.", price: 79.9, tint: "#c98bb0", points: ["Sem refil", "Tecido, veludo e couro", "Cabe na gaveta"] },
  { id: "short-m", art: "art-shorts-m", name: "Short 2 em 1 masculino antiatrito", short: "Short M", text: "Bermuda de compressão por dentro, que não deixa a coxa assar.", price: 99.9, tint: "#5f6b7a", points: ["Secagem rápida", "Bolso lateral", "PP ao GG"] },
  { id: "short-f", art: "art-shorts-f", name: "Short de corrida feminino", short: "Short F", text: "Leve, com laterais ventiladas e bolso para a chave.", price: 99.9, tint: "#b07ac9", points: ["Não marca", "Bolso interno", "PP ao GG"] },
  { id: "oculos", art: "art-oculos", name: "Óculos polarizado UV400", short: "Óculos", text: "Lente polarizada e ponteiras que não escorregam com o suor.", price: 89.9, tint: "#3d4a5c", points: ["Proteção UV400", "Leve", "Com estojo"] },
  { id: "cinto", art: "art-cinto", name: "Cinto porta-celular para corrida", short: "Cinto", text: "Segura celular, chave e cartão sem balançar na corrida.", price: 79.9, tint: "#d08a4a", points: ["Elástico", "Saída para fone", "Lavável"] },
];
