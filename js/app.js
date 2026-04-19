/**
 * ANHS Intelligence OS - Kernel v4.0.2
 */
const Terminal = {
  output: null,
  input: null,
  commands: ['help', 'ls', 'cat', 'roll', 'clear', 'whoami', 'enroll', 'export', 'music'],
  files: ['quick-start.log', 'attributes.bin', 'skills.db', 'traits.json', 'economy.xlsm', 'protocols.pdf', 'hidden-level.enc'],
  
  audio: {
    element: null,
    playing: false,
    volume: 0.15
  },

  init() {
    this.output = document.getElementById('termOutput');
    this.input = document.getElementById('cmdInput');
    this.audio.element = document.getElementById('bgMusic');
    
    if (this.audio.element) {
      this.audio.element.volume = this.audio.volume;
      
      // Tenta tocar automaticamente
      const startAudio = () => {
        this.audio.element.play().then(() => {
          this.audio.playing = true;
          const label = document.querySelector('#music-control span');
          if (label) label.innerText = "AMB_AUDIO: ON";
          // Remove os listeners após o primeiro sucesso
          window.removeEventListener('click', startAudio);
          window.removeEventListener('keydown', startAudio);
        }).catch(() => {
          // Bloqueado pelo browser
        });
      };

      // Adiciona listeners para garantir o início na primeira interação
      window.addEventListener('click', startAudio);
      window.addEventListener('keydown', startAudio);
      
      // Tentativa imediata
      startAudio();
    }

    this.print("SYSTEM_LOADED: Core engine active.");
    this.print("Type 'help' to see list of commands. Use <span class='highlight'>TAB</span> to autocomplete.");
  },

  autocomplete() {
    const val = this.input.value.toLowerCase();
    if (!val) return;

    const parts = val.split(' ');
    const cmd = parts[0];
    const query = parts.slice(1).join(' ');

    // 1. Sugestões de Comandos Base (sempre disponível)
    if (parts.length === 1) {
      const allCmds = [...this.commands, 'next', 'finish', 'list'];
      const matches = allCmds.filter(c => c.startsWith(val));
      if (matches.length === 1) {
        this.input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.print(`Sugestões: ${matches.join(', ')}`, 'system');
      }
      return;
    }

    // 2. Autocomplete de Arquivos (cat)
    if (cmd === 'cat' && parts.length === 2) {
      const matches = this.files.filter(f => f.startsWith(parts[1]));
      if (matches.length === 1) {
        this.input.value = `cat ${matches[0]}`;
      } else if (matches.length > 1) {
        this.print(`Arquivos: ${matches.join(', ')}`, 'system');
      }
      return;
    }

    // 3. Autocomplete de Atributos (set)
    if (this.session.active && this.session.step === 'allocating_attributes' && cmd === 'set') {
      const matches = this.systemData.attributes.filter(a => a.toLowerCase().startsWith(query));
      if (matches.length === 1) {
        this.input.value = `set ${matches[0]} `;
      } else if (matches.length > 1) {
        this.print(`Atributos: ${matches.join(', ')}`, 'system');
      }
      return;
    }

    // 4. Autocomplete de Perícias (buy)
    if (this.session.active && this.session.step === 'allocating_skills' && cmd === 'buy') {
      const allSkills = Object.values(this.systemData.skills).flat();
      const matches = allSkills.filter(s => s.toLowerCase().startsWith(query));
      if (matches.length === 1) {
        this.input.value = `buy ${matches[0]} `;
      } else if (matches.length > 1) {
        this.print(`Perícias: ${matches.join(', ')}`, 'system');
      }
      return;
    }
  },

  print(text, type = '') {
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    div.innerHTML = text;
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  },

  execute(cmd) {
    const raw = cmd.trim();
    if (!raw && !this.session.active) return;
    
    this.print(`<span class="prompt-symbol">ANHS@TERMINAL:~$</span> ${raw}`);
    const normalized = raw.toLowerCase();
    
    if (this.session.active) {
      this.handleSession(normalized, raw);
      return;
    }

    const args = normalized.split(' ');
    const command = args[0];

    switch (command) {
      case 'help':
        this.print("Available Commands:");
        this.print("  ls          - List virtual files");
        this.print("  cat [file]  - Read file");
        this.print("  enroll      - Start registration");
        this.print("  export      - Save character dossier as image");
        this.print("  roll        - Roll 4dF");
        this.print("  clear       - Clear terminal");
        this.print("  whoami      - Display user info");
        break;

      case 'enroll':
        this.startEnrollment(args.includes('--elite'));
        break;

      case 'export':
        this.exportDossier();
        break;

      case 'ls':
        this.print("Directory: /S-SYSTEM/RULES");
        this.print("  quick-start.log  attributes.bin  skills.db");
        this.print("  traits.json      economy.xlsm    protocols.pdf");
        break;

      case 'roll':
        this.rollDice();
        break;

      case 'cat':
        if(!args[1]) this.print("Error: No file specified.", "error");
        else this.readFile(args[1]);
        break;

      case 'whoami':
        this.print(`USER_ID: ${this.session.data.name}`);
        this.print("CLASS: 1-D (PROVISIONAL) | STATUS: " + (this.session.data.name === 'ANONYMOUS' ? 'GUEST' : 'ACTIVE'));
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.print(`Command not found: ${command}`, "error");
    }
  },

  startEnrollment(isElite) {
    this.session.active = true;
    this.session.step = 'awaiting_name';
    this.session.data.traits = [];
    this.session.data.skills = {};
    this.session.data.attributes = { "Intelecto": 0, "Físico": 0, "Carisma": 0, "Percepção": 0, "Controle": 0, "Estratégia": 0 };
    this.session.data.skillPoints = 30;
    this.session.data.traitPoints = 6;
    
    if (isElite) {
      this.session.data.pp = 120000;
      this.print("[SYSTEM] Parâmetro --elite detectado. Reconhecendo potencial estratégico.");
      this.print("[SYSTEM] Créditos iniciais: <span class='highlight'>¥120.000 PP</span>.");
    } else {
      this.session.data.pp = 100000;
    }

    this.print("<br>Iniciando registro de estudante. Por favor, identifique-se.");
    this.print("Digite seu <span class='highlight'>NOME COMPLETO</span>:");
  },

  handleSession(input, originalCase) {
    const step = this.session.step;

    if (step === 'awaiting_name') {
      this.session.data.name = originalCase.toUpperCase();
      this.print(`[OK] Identidade confirmada: ${this.session.data.name}`);
      this.session.step = 'awaiting_standard_confirm';
      this.print("<br>PASSO 1: CONFIGURAÇÃO DE ATRIBUTOS");
      this.print("O sistema gerou um perfil padrão equilibrado (Nível 1 em tudo).");
      this.print("<span class='highlight'>Deseja aceitar o Perfil Padrão? [Y/n]</span>");
    }

    else if (step === 'awaiting_standard_confirm') {
      if (input === 'y' || input === 'yes') {
        Object.keys(this.session.data.attributes).forEach(k => this.session.data.attributes[k] = 1);
        this.print("[SYSTEM] Perfil aceito.");
        this.goToSkills();
      } else if (input === 'n' || input === 'no') {
        this.print("<span class='error'>[ALERTA] Desobediência detectada. Pensamento independente recompensado.</span>");
        this.print("[BÔNUS] Traço desbloqueado: <span class='highlight'>Carta na Manga</span>");
        this.session.data.traits.push("Carta na Manga");
        this.session.step = 'allocating_attributes';
        this.print("<br>Distribua 6 pontos. Use: <span class='highlight'>set [atributo] [valor]</span>");
        this.print("Atributos: Intelecto, Físico, Carisma, Percepção, Controle, Estratégia");
        this.print("Exemplo: set Intelecto 2. Digite <span class='highlight'>next</span> para continuar.");
      }
    } 
    
    else if (step === 'allocating_attributes') {
      if (input === 'next') {
        this.goToSkills();
        return;
      }

      const args = input.split(' ');
      if (args[0] === 'set' && args.length === 3) {
        const attrKey = Object.keys(this.session.data.attributes).find(k => k.toLowerCase() === args[1]);
        const val = parseInt(args[2]);
        if (!attrKey || isNaN(val)) return this.print("Erro: Comando inválido. Use 'set [atributo] [valor]'.", "error");

        const currentTotal = Object.values(this.session.data.attributes).reduce((a, b) => a + b, 0);
        const diff = val - this.session.data.attributes[attrKey];
        
        if (currentTotal + diff > 6) {
          this.pendingData = { type: 'attr', attr: attrKey, val: val, diff: diff };
          this.session.step = 'buy_points_confirm';
          this.print(`<br><span class='error'>[AVISO] Limite de 6 pontos excedido.</span>`);
          this.print(`Deseja cobrir o déficit utilizando Pontos Privados? (Custo: <span class='highlight'>¥50.000 PP</span> por ponto extra). [Y/n]`);
        } else {
          this.session.data.attributes[attrKey] = val;
          const total = Object.values(this.session.data.attributes).reduce((a, b) => a + b, 0);
          this.print(`> ${attrKey}: ${this.getLvlName(val)} (Total: ${total}/6)`);
        }
      }
    }

    else if (step === 'allocating_skills') {
      if (input === 'next') {
        this.goToTraits();
        return;
      }
      if (input === 'list') {
        this.print("Categorias: ACADÊMICAS, SOCIAIS, INFORMAÇÃO, ESTRATÉGICAS, FÍSICAS, OCULTAÇÃO.");
        this.print("Use 'list [categoria]' para ver perícias.");
        return;
      }
      
      const args = input.split(' ');
      if (args[0] === 'list' && args[1]) {
        const cat = args[1].toUpperCase();
        if (this.systemData.skills[cat]) {
          this.print(`Perícias [${cat}]: ${this.systemData.skills[cat].join(', ')}`);
        } else {
          this.print("Erro: Categoria não encontrada.", "error");
        }
      }

      if (args[0] === 'buy' && args.length >= 3) {
        const val = parseInt(args[args.length - 1]);
        const skillInput = args.slice(1, args.length - 1).join(' ').toLowerCase();
        
        // Busca inteligente da perícia (suporta nomes parciais)
        let skillName = null;
        for(let cat in this.systemData.skills) {
          const found = this.systemData.skills[cat].find(s => s.toLowerCase().includes(skillInput));
          if(found) {
            skillName = found;
            break;
          }
        }

        if(!skillName) return this.print(`Erro: Nenhuma perícia correspondente a '${skillInput}' encontrada.`, "error");
        if(isNaN(val) || val < -3 || val > 3) return this.print("Erro: Nível inválido (-3 a 3).", "error");

        const currentLvl = this.session.data.skills[skillName] || -2; // Padrão é Ruim (-2)
        const currentCost = this.systemData.skillCosts[currentLvl + 3];
        const newCost = this.systemData.skillCosts[val + 3];
        const costDiff = newCost - currentCost;

        if (this.session.data.skillPoints >= costDiff) {
          this.session.data.skillPoints -= costDiff;
          this.session.data.skills[skillName] = val;
          this.print(`> <span class='highlight'>${skillName}</span> definido para ${this.getLvlName(val)}.`);
          this.print(`Pontos de Perícia: ${this.session.data.skillPoints}/30`);
        } else {
          this.print(`Erro: Pontos insuficientes. Custo para ${this.getLvlName(val)}: ${costDiff} pts.`, "error");
        }
      }
    }

    else if (step === 'allocating_traits') {
      if (input === 'finish') {
        this.finishEnrollment();
        return;
      }
      if (input === 'list') {
        this.print("Consulte o arquivo 'traits_manifest.json' (cat traits) para ver as opções.");
        return;
      }
      
      const args = input.split(' ');
      if (args[0] === 'add' && args.length >= 2) {
        const name = args.slice(1).join(' ');
        this.addTrait(name);
      }
    }

    else if (step === 'buy_points_confirm') {
      if (input === 'y' || input === 'yes') {
        const cost = 50000;
        if (this.session.data.pp >= cost) {
          this.session.data.pp -= cost;
          this.session.data.attributes[this.pendingData.attr] = this.pendingData.val;
          this.print(`[S-SYSTEM] Transação autorizada. Saldo: ¥${this.session.data.pp}`);
          this.session.step = 'allocating_attributes';
        } else {
          this.print("[ERRO] Saldo insuficiente.", "error");
          this.session.step = 'allocating_attributes';
        }
      } else {
        this.session.step = 'allocating_attributes';
        this.print("Operação cancelada.");
      }
    }
  },

  goToSkills() {
    this.session.step = 'allocating_skills';
    this.print("<br>PASSO 2: ESPECIALIZAÇÕES (PERÍCIAS)");
    this.print("Você possui <span class='highlight'>30 pontos</span>.");
    this.print("Use: <span class='highlight'>buy [perícia] [nível]</span> (Níveis: -3 a 3)");
    this.print("Digite <span class='highlight'>list</span> para ver categorias ou <span class='highlight'>next</span>.");
  },

  goToTraits() {
    this.session.step = 'allocating_traits';
    this.print("<br>PASSO 3: BÊNÇÃOS & FALHAS");
    this.print("Você possui <span class='highlight'>6 pontos</span> de traço.");
    this.print("Use: <span class='highlight'>add [nome]</span>");
    this.print("Digite <span class='highlight'>finish</span> para concluir.");
  },

  async addTrait(name) {
    try {
      const resp = await fetch('data/traits.json');
      const data = await resp.json();
      let trait = null;
      let isBlessing = true;

      for(let cat in data.blessings) {
        trait = data.blessings[cat].find(t => t.name.toLowerCase() === name.toLowerCase());
        if(trait) break;
      }
      if(!trait) {
        for(let cat in data.flaws) {
          trait = data.flaws[cat].find(t => t.name.toLowerCase() === name.toLowerCase());
          if(trait) { isBlessing = false; break; }
        }
      }

      if(!trait) return this.print(`Erro: Traço '${name}' não encontrado.`, "error");

      // PROTEÇÃO: Verifica se já possui o traço
      if (this.session.data.traits.includes(trait.name)) {
        return this.print(`Aviso: Você já possui o traço '${trait.name}'. Operação abortada.`, "system");
      }

      const cost = isBlessing ? trait.cost : -trait.gain;
      if (this.session.data.traitPoints >= cost) {
        this.session.data.traitPoints -= cost;
        this.session.data.traits.push(trait.name);
        this.print(`> Traço '${trait.name}' adicionado. Restante: ${this.session.data.traitPoints}`);
      } else {
        this.print("Erro: Pontos insuficientes.", "error");
      }
    } catch(e) { this.print("Erro de uplink com banco de dados.", "error"); }
  },

  getLvlName(v) {
    return this.systemData.levels[v + 3] || "Mediano";
  },

  finishEnrollment() {
    this.print("<br>==========================================");
    this.print("REGISTRO FINALIZADO. DOSSIÊ COMPILADO.");
    this.print(`ESTUDANTE: ${this.session.data.name}`);
    this.print(`CRÉDITOS: ¥${this.session.data.pp} PP`);
    this.print("==========================================");
    this.print("Digite <span class='highlight'>export</span> para salvar a ficha visual.");
    this.session.active = false;
    this.session.step = 'idle';
  },

  exportDossier() {
    if (this.session.data.name === 'ANONYMOUS') return this.print("Erro: Nenhum registro ativo encontrado.", "error");

    this.print("Gerando representação visual do Dossiê...");
    
    const dossier = document.createElement('div');
    dossier.id = 'tempDossier';
    dossier.style.cssText = `
      position: fixed; left: -9999px; top: 0; width: 700px; padding: 40px;
      background: #050505; color: #00ff41; font-family: 'Fira Code', monospace;
      border: 2px solid #008f11;
    `;

    const getLvl = (v) => this.getLvlName(v);

    dossier.innerHTML = `
      <div style="border: 1px solid #008f11; padding: 30px;">
        <h1 style="color:#ff003c; text-align:center; border-bottom:1px solid #008f11; padding-bottom:15px; margin-bottom:20px;">ANHS STUDENT DOSSIER</h1>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div>
            <p>NAME: ${this.session.data.name}</p>
            <p>CLASS: 1-D (PROVISIONAL)</p>
          </div>
          <div style="text-align:right;">
            <p>CREDITS: ¥${this.session.data.pp}</p>
            <p>STATUS: ACTIVE</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <div style="border:1px solid #003b00; padding:15px;">
            <h3 style="color:#ff003c; font-size:0.9rem; margin-bottom:10px;">[ ATTRIBUTES ]</h3>
            ${Object.entries(this.session.data.attributes).map(([k, v]) => `
              <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                <span>${k.toUpperCase()}</span>
                <span>${getLvl(v)} (${v >= 0 ? '+'+v : v})</span>
              </div>
            `).join('')}
          </div>
          
          <div style="border:1px solid #003b00; padding:15px;">
            <h3 style="color:#ff003c; font-size:0.9rem; margin-bottom:10px;">[ TRAITS ]</h3>
            <div style="font-size:0.8rem;">${this.session.data.traits.join(', ') || 'NONE'}</div>
          </div>
        </div>

        <div style="margin-top:20px; border:1px solid #003b00; padding:15px;">
          <h3 style="color:#ff003c; font-size:0.9rem; margin-bottom:10px;">[ SPECIALIZED SKILLS ]</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.75rem;">
            ${Object.entries(this.session.data.skills).filter(([_,v]) => v > -2).map(([k, v]) => `
              <div style="display:flex; justify-content:space-between;">
                <span>${k}</span>
                <span>${getLvl(v)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <p style="text-align:center; font-size:9px; opacity:0.5; margin-top:30px;">PROPERTY OF TOKYO METROPOLITAN ADVANCED NURTURING HIGH SCHOOL - S-SYSTEM ENCRYPTION ACTIVE</p>
      </div>
    `;

    document.body.appendChild(dossier);

    if (window.html2canvas) {
      html2canvas(dossier).then(canvas => {
        const link = document.createElement('a');
        link.download = `DOSSIER_${this.session.data.name.replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
        document.body.removeChild(dossier);
        this.print("DOSSIÊ EXPORTADO COM SUCESSO. VERIFIQUE SEUS DOWNLOADS.");
      });
    }
  },

  rollDice() {
    const dice = [];
    let total = 0;
    for(let i=0; i<4; i++){
      const r = Math.floor(Math.random()*3)-1;
      dice.push(r === 1 ? '+' : (r === -1 ? '-' : '0'));
      total += r;
    }
    this.print(`EXECUTING 4dF_DICE_ROLL...`);
    this.print(`RESULT: [${dice.join(' ')}] = <span class="highlight">${total > 0 ? '+'+total : total}</span>`);
  },

  readFile(fileName) {
    const fileMap = {
      'quick-start.log': 'quick-start',
      'attributes.bin': 'attributes',
      'skills.db': 'skills',
      'traits.json': 'traits',
      'economy.xlsm': 'economy',
      'protocols.pdf': 'protocols',
      'hidden-level.enc': 'hidden-level'
    };

    const targetKey = fileMap[fileName.toLowerCase()] || fileName.split('.')[0].toLowerCase();

    // Lógica especial para arquivos que exigem renderização complexa
    if (targetKey === 'traits' && typeof Renderers !== 'undefined') {
      Renderers.renderTraits();
      return;
    }
    if (targetKey === 'skills' && typeof Renderers !== 'undefined') {
      Renderers.renderSkills();
      return;
    }

    this.print(`OPENING ${fileName}...`);

    if (typeof Navigation !== 'undefined' && Navigation.getContent) {
      const content = Navigation.getContent(targetKey);
      if (content) {
        this.print(content);
      } else {
        this.print(`Error: File ${fileName} is corrupted or encrypted.`, "error");
      }
    } else {
      this.print("Error: Navigation module not linked.", "error");
    }
  },
};