/**
 * ANHS Intelligence FS - Data Provider
 */
const Navigation = {
  getContent(node) {
    const data = {
      'quick-start': `
        <div class="rule-card">
          [ QUICK START PROTOCOL ]<br><br>
          Classroom of the Elite RPG utiliza o motor FUDGE.<br>
          O foco é <span class="highlight">Guerra Psicológica</span> e <span class="highlight">Estratégia</span>.<br><br>
          ESCALA FUDGE:<br>
          +3 Soberbo | +2 Ótimo | +1 Bom | 0 Mediano | -1 Medíocre | -2 Ruim | -3 Péssimo<br><br>
          Para iniciar seu registro no sistema, utilize o comando: <span class="highlight">enroll</span><br>
          <span style="opacity: 0.2; font-size: 0.6rem; display: block; margin-top: 10px;">Candidatos com potencial estratégico de classe S podem acionar o parâmetro --elite durante o registro.</span>
        </div>
      `,
      'attributes': `
        <div class="rule-card">
          [ ATTRIBUTE MATRIX ]<br><br>
          🧠 INTELECTO   - Capacidade acadêmica e raciocínio lógico.<br>
          💪 FÍSICO      - Força, resistência e performance atlética.<br>
          🎭 CARISMA     - Liderança, influência e persuasão.<br>
          👁️ PERCEPÇÃO   - Coleta de dados e detecção de mentiras.<br>
          🧊 CONTROLE    - Estabilidade mental e máscara emocional.<br>
          ♟️ ESTRATÉGIA  - Planejamento tático e gestão de recursos.
        </div>
      `,
      'skills': `
        <div class="rule-card">
          [ SKILL DATABASE ]<br><br>
          As perícias são especializações que superam os atributos.<br>
          O custo para aumentar depende do nível desejado (0 a 5 pontos).<br><br>
          Categorias: ACADÊMICAS, SOCIAIS, INFORMAÇÃO, ESTRATÉGICAS, FÍSICAS, OCULTAÇÃO.<br>
          Utilize o comando <span class='highlight'>list [categoria]</span> durante o 'enroll' para detalhes.
        </div>
      `,
      'traits': `
        <div class="rule-card">
          [ TRAITS MANIFEST ]<br><br>
          Bênçãos e Falhas definem traços únicos fora da escala normal.<br>
          Custo base: 6 pontos iniciais. Falhas concedem pontos extras.<br><br>
          Consulte o manual impresso ou o banco de dados dinâmico via <span class='highlight'>cat traits</span> para ver a lista completa carregada do sistema.
        </div>
      `,
      'economy': `
        <div class="rule-card">
          [ ECONOMY REPORT ]<br><br>
          PdC (PONTOS DE CLASSE): Recurso Coletivo da Turma.<br>
          A: 1200 | B: 1000 | C: 800 | D: 600<br><br>
          PP (PONTOS PRIVADOS): ¥100.000 mensais base.<br>
          Negociações de PP podem envolver testes de Negociação em Ações Opostas.
        </div>
      `,
      'protocols': `
        <div class="rule-card">
          [ TACTICAL PROTOCOLS ]<br><br>
          1. EXAMES ESCOLARES: Resultados individuais somados coletivamente.<br>
          2. CONFLITOS SOCIAIS: Ações opostas visando +4 pontos de pressão.<br>
          3. TESTES DE SOBREVIVÊNCIA: Gestão de Pontos de Recurso (PR) em campo.
        </div>
      `,
      'hidden-level': `
        <div class="rule-card" style="border-color: #ff0000; color: #ff0000;">
          [ !!! TOP SECRET - REDACTED !!! ]<br><br>
          Mecânica de Nível Oculto Ativa.<br>
          Nível Aparente: O que os outros veem.<br>
          Nível Real: Capacidade verdadeira (até 2 níveis acima).<br>
          Revelação custa Pontos de Controle Narrativo e gera 3 PP Especiais.
        </div>
      `
    };
    return data[node] || null;
  }
};