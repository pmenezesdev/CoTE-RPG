const FUDGE_SYSTEM = {
    levels: [
        { name: "Péssimo", value: -3 },
        { name: "Ruim", value: -2 },
        { name: "Medíocre", value: -1 },
        { name: "Mediano", value: 0 },
        { name: "Bom", value: 1 },
        { name: "Ótimo", value: 2 },
        { name: "Soberbo", value: 3 }
    ],
    attributes: [
        { id: "int", name: "Intelecto", icon: "🧠", description: "Capacidade analítica e desempenho acadêmico." },
        { id: "fis", name: "Físico", icon: "💪", description: "Força, resistência e atletismo." },
        { id: "soc", name: "Carisma Social", icon: "🎭", description: "Habilidade de influenciar e liderar." },
        { id: "per", name: "Percepção", icon: "👁️", description: "Ler pessoas e detectar detalhes." },
        { id: "ctr", name: "Controle", icon: "🧊", description: "Autocontrole e resistência à manipulação." },
        { id: "est", name: "Estratégia", icon: "♟️", description: "Planejamento e gestão de recursos." }
    ],
    skills: {
        academic: ["Matemática", "Ciências Naturais", "Língua Japonesa", "Língua Estrangeira", "Humanidades", "Lógica e Dedução", "Memorização"],
        social: ["Manipulação", "Persuasão", "Liderança", "Sedução", "Mentir", "Detectar Mentiras", "Negociação", "Intimidação", "Etiqueta Escolar", "Rede de Contatos"],
        info: ["Vigilância", "Investigação", "Ler Pessoas", "Encontrar Segredos", "Contrainteligência"],
        strategy: ["Tática de Teste Especial", "Gestão de Recursos", "Análise de Oponentes", "Formação de Alianças", "Blefe"],
        physical: ["Atletismo", "Resistência", "Combate", "Furtividade", "Primeiros Socorros", "Sobrevivência", "Orientação"],
        concealment: ["Mascarar Emoções", "Disfarce Social", "Jogar de Fraco", "Resistir à Pressão"]
    },
    blessings: [
        { name: "Mente Calculista", effect: "+1 em Estratégia/Lógica com tempo de preparo." },
        { name: "Máscara Perfeita", effect: "Esconde SOC ou CTR real gastando PP." },
        { name: "Carta na Manga", effect: "Possui Nível Oculto em um atributo." },
        { name: "Atleta de Elite", effect: "+1 em todos os testes físicos." },
        { name: "Memória Fotográfica", effect: "Sucesso automático em memorização simples." },
        { name: "Líder Nato", effect: "+1 para aliados em ações de grupo." },
        { name: "Rede de Informações", effect: "Dica do Mestre uma vez por sessão." },
        { name: "Ferro Por Dentro", effect: "+2 para resistir à manipulação." }
    ],
    flaws: [
        { name: "Orgulho Excessivo", effect: "Teste de CTR ou aceitar desafios públicos." },
        { name: "Incapaz de Trabalhar em Equipe", effect: "-2 em testes colaborativos." },
        { name: "Explosivo", effect: "Reage impulsivamente se provocado." },
        { name: "Fama Suspeita", effect: "Dificuldade inicial social aumentada." },
        { name: "Segredo Perigoso", effect: "Informação que pode causar expulsão." },
        { name: "Dívida de Pontos", effect: "Começa com metade dos PP." },
        { name: "Solitário Crônico", effect: "-2 em coordenação, +1 individual furtivo." }
    ]
};