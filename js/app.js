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

  session: {
    active: false,
    step: 'idle',
    data: {
      name: 'ANONYMOUS',
      pp: 100000,
      attrPoints: 6,
      skillPoints: 30,
      traitPoints: 6,
      attributes: { "Intelecto": 0, "Físico": 0, "Carisma": 0, "Percepção": 0, "Controle": 0, "Estratégia": 0 },
      skills: {},
      traits: []
    }
  },

  systemData: {
    levels: ["Péssimo", "Ruim", "Medíocre", "Mediano", "Bom", "Ótimo", "Soberbo"],
    skillCosts: [1, 0, 1, 2, 3, 4, 5], 
    attributes: ["Intelecto", "Físico", "Carisma", "Percepção", "Controle", "Estratégia"],
    skills: {
      "ACADÊMICAS": ["Matemática", "Ciências Naturais", "Língua Japonesa", "Língua Estrangeira", "Humanidades", "Lógica e Dedução", "Memorização"],
      "SOCIAIS": ["Manipulação", "Persuasão", "Liderança", "Sedução", "Mentir", "Detectar Mentiras", "Negociação", "Intimidação", "Etiqueta Escolar", "Rede de Contatos"],
      "INFORMAÇÃO": ["Vigilância", "Investigação", "Ler Pessoas", "Encontrar Segredos", "Contrainteligência"],
      "ESTRATÉGICAS": ["Tática de Teste Especial", "Gestão de Recursos", "Análise de Oponentes", "Formação de Alianças", "Blefe"],
      "FÍSICAS": ["Atletismo", "Resistência", "Combate", "Furtividade", "Primeiros Socorros", "Sobrevivência", "Orientação"],
      "OCULTAÇÃO": ["Mascarar Emoções", "Disfarce Social", "Jogar de Fraco", "Resistir à Pressão"]
    }
  },

  boot() {
    const bootScreen = document.getElementById('boot-screen');
    const appContainer = document.getElementById('app');
    this.audio.element = document.getElementById('bgMusic');

    // Inicializa interface antes da revelação
    this.output = document.getElementById('termOutput');
    this.input = document.getElementById('cmdInput');

    // Inicia música (interação garantida pelo clique)
    if (this.audio.element) {
      this.audio.element.volume = this.audio.volume;
      this.audio.element.play().then(() => {
        this.audio.playing = true;
        this.updateAudioUI(true);
      }).catch(e => console.warn("Autoplay blocked or failed."));
    }

    bootScreen.style.opacity = '0';
    setTimeout(() => {
      bootScreen.style.display = 'none';
      appContainer.classList.add('loaded');
      
      this.print("INITIALIZING ANHS_CORE_OS...");
      setTimeout(() => this.print("LOADING_RULES_DATABASE... OK."), 400);
      setTimeout(() => this.print("ESTABLISHING_ENCRYPTED_UPLINK... OK."), 800);
      setTimeout(() => {
        this.print("<br>Welcome to the Advanced Nurturing High School Intelligence Network.");
        this.print("Type 'help' to see list of commands. Use <span class='highlight'>TAB</span> to autocomplete.");
        if (this.input) this.input.focus();
      }, 1200);
    }, 1000);
  },

  updateAudioUI(active) {
    const label = document.querySelector('#music-control span');
    if (label) label.innerText = active ? "AMB_AUDIO: ON" : "AMB_AUDIO: OFF";
  },

  toggleMusic() {
    if (!this.audio.element) return;
    if (this.audio.playing) {
      this.audio.element.pause();
      this.audio.playing = false;
      this.updateAudioUI(false);
      this.print("AMBIENT_AUDIO: Terminated.");
    } else {
      this.audio.element.play().then(() => {
        this.audio.playing = true;
        this.updateAudioUI(true);
        this.print("AMBIENT_AUDIO: Restored.");
      });
    }
  },

  print(text, type = '') {
    if (!this.output) return;
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
        this.print("  export      - Save dossier as image");
        this.print("  roll        - Roll 4dF");
        this.print("  music       - Toggle ambiance");
        this.print("  clear       - Clear screen");
        break;
      case 'enroll': this.startEnrollment(args.includes('--elite')); break;
      case 'export': this.exportDossier(); break;
      case 'ls': this.print("Files: quick-start.log, attributes.bin, skills.db, traits.json, economy.xlsm, protocols.pdf"); break;
      case 'roll': this.rollDice(); break;
      case 'music': this.toggleMusic(); break;
      case 'clear': this.output.innerHTML = ''; break;
      case 'cat':
        if(!args[1]) this.print("Error: No file specified.", "error");
        else this.readFile(args[1]);
        break;
      default: this.print(`Command not found: ${command}`, "error");
    }
  },

  autocomplete() {
    const val = this.input.value.toLowerCase();
    if (!val) return;
    const parts = val.split(' ');
    const cmd = parts[0];
    const query = parts.slice(1).join(' ');

    if (parts.length === 1) {
      const all = [...this.commands, 'next', 'finish', 'list'];
      const matches = all.filter(c => c.startsWith(val));
      if (matches.length === 1) this.input.value = matches[0] + ' ';
      return;
    }

    if (cmd === 'cat' && parts.length === 2) {
      const matches = this.files.filter(f => f.startsWith(parts[1]));
      if (matches.length === 1) this.input.value = `cat ${matches[0]}`;
      return;
    }

    if (this.session.active) {
      if (this.session.step === 'allocating_attributes' && cmd === 'set') {
        const matches = this.systemData.attributes.filter(a => a.toLowerCase().startsWith(query));
        if (matches.length === 1) this.input.value = `set ${matches[0]} `;
      }
      if (this.session.step === 'allocating_skills' && cmd === 'buy') {
        const allSkills = Object.values(this.systemData.skills).flat();
        const matches = allSkills.filter(s => s.toLowerCase().startsWith(query));
        if (matches.length === 1) this.input.value = `buy ${matches[0]} `;
      }
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
      this.print("[SYSTEM] Mode: ELITE_ENROLLMENT. Initial PP: ¥120.000.");
    } else {
      this.session.data.pp = 100000;
    }
    this.print("<br>IDENTIFICATION REQUIRED. Type your FULL NAME:");
  },

  handleSession(input, originalCase) {
    const step = this.session.step;
    if (step === 'awaiting_name') {
      this.session.data.name = originalCase.toUpperCase();
      this.print(`[OK] ID: ${this.session.data.name}`);
      this.session.step = 'awaiting_standard_confirm';
      this.print("<br>PASSO 1: ATRIBUTOS. Aceitar perfil padrão (Nível 1 em tudo)? [Y/n]");
    }
    else if (step === 'awaiting_standard_confirm') {
      if (input === 'y' || input === 'yes') {
        Object.keys(this.session.data.attributes).forEach(k => this.session.data.attributes[k] = 1);
        this.goToSkills();
      } else {
        this.print("<span class='error'>[ALERTA] Desobediência detectada. Bônus: 'Carta na Manga'.</span>");
        this.session.data.traits.push("Carta na Manga");
        this.session.step = 'allocating_attributes';
        this.print("<br>Distribua 6 pontos. Ex: 'set Intelecto 2'. Digite 'next' para continuar.");
      }
    }
    else if (step === 'allocating_attributes') {
      if (input === 'next') { this.goToSkills(); return; }
      const args = input.split(' ');
      if (args[0] === 'set' && args.length === 3) {
        const attrKey = Object.keys(this.session.data.attributes).find(k => k.toLowerCase() === args[1]);
        const val = parseInt(args[2]);
        if (!attrKey || isNaN(val)) return this.print("Erro: 'set [Atributo] [Valor]'.", "error");
        const currentTotal = Object.values(this.session.data.attributes).reduce((a, b) => a + b, 0);
        const diff = val - this.session.data.attributes[attrKey];
        if (currentTotal + diff > 6) {
          this.pendingData = { attr: attrKey, val: val };
          this.session.step = 'buy_points_confirm';
          this.print(`<br><span class='error'>Déficit detectado. Comprar ponto extra por ¥50.000? [Y/n]</span>`);
        } else {
          this.session.data.attributes[attrKey] = val;
          const total = Object.values(this.session.data.attributes).reduce((a, b) => a + b, 0);
          this.print(`> ${attrKey}: ${this.getLvlName(val)} (Total: ${total}/6)`);
        }
      }
    }
    else if (step === 'buy_points_confirm') {
      if (input === 'y' || input === 'yes') {
        if (this.session.data.pp >= 50000) {
          this.session.data.pp -= 50000;
          this.session.data.attributes[this.pendingData.attr] = this.pendingData.val;
          this.print(`[OK] Saldo: ¥${this.session.data.pp}`);
          this.session.step = 'allocating_attributes';
        } else { this.print("Erro: Saldo insuficiente.", "error"); this.session.step = 'allocating_attributes'; }
      } else { this.session.step = 'allocating_attributes'; this.print("Cancelado."); }
    }
    else if (step === 'allocating_skills') {
      if (input === 'next') { this.goToTraits(); return; }
      const args = input.split(' ');
      if (args[0] === 'buy' && args.length >= 3) {
        const val = parseInt(args[args.length - 1]);
        const skillIn = args.slice(1, args.length - 1).join(' ').toLowerCase();
        let sName = null;
        for(let cat in this.systemData.skills) {
          const found = this.systemData.skills[cat].find(s => s.toLowerCase().includes(skillIn));
          if(found) { sName = found; break; }
        }
        if(!sName) return this.print("Erro: Perícia não encontrada.", "error");
        const currentLvl = this.session.data.skills[sName] || -2;
        const diff = this.systemData.skillCosts[val+3] - this.systemData.skillCosts[currentLvl+3];
        if (this.session.data.skillPoints >= diff) {
          this.session.data.skillPoints -= diff;
          this.session.data.skills[sName] = val;
          this.print(`> ${sName}: ${this.getLvlName(val)}. Restante: ${this.session.data.skillPoints}`);
        } else { this.print("Erro: Pontos insuficientes.", "error"); }
      }
    }
    else if (step === 'allocating_traits') {
      if (input === 'finish') { this.finishEnrollment(); return; }
      const args = input.split(' ');
      if (args[0] === 'add' && args.length >= 2) this.addTrait(args.slice(1).join(' '));
    }
  },

  goToSkills() {
    this.session.step = 'allocating_skills';
    this.print("<br>PASSO 2: PERÍCIAS (30 pts). Use 'buy [nome] [nível]'. Digite 'next' para avançar.");
  },

  goToTraits() {
    this.session.step = 'allocating_traits';
    this.print("<br>PASSO 3: TRAÇOS (6 pts). Use 'add [nome]'. Digite 'finish' para concluir.");
  },

  async addTrait(name) {
    try {
      const resp = await fetch('data/traits.json');
      const data = await resp.json();
      let t = null; let isB = true;
      for(let cat in data.blessings) { t = data.blessings[cat].find(x => x.name.toLowerCase() === name.toLowerCase()); if(t) break; }
      if(!t) { for(let cat in data.flaws) { t = data.flaws[cat].find(x => x.name.toLowerCase() === name.toLowerCase()); if(t) { isB = false; break; } } }
      if(!t) return this.print("Erro: Traço não encontrado.", "error");
      if(this.session.data.traits.includes(t.name)) return this.print("Aviso: Já possui este traço.");
      const cost = isB ? t.cost : -t.gain;
      if (this.session.data.traitPoints >= cost) {
        this.session.data.traitPoints -= cost;
        this.session.data.traits.push(t.name);
        this.print(`> Adicionado: ${t.name}. Restante: ${this.session.data.traitPoints}`);
      } else { this.print("Erro: Pontos insuficientes.", "error"); }
    } catch(e) { this.print("Erro: uplink falhou.", "error"); }
  },

  getLvlName(v) { return this.systemData.levels[v+3] || "Mediano"; },

  finishEnrollment() {
    this.print("<br>==========================================");
    this.print("DOSSIÊ CONCLUÍDO. Digite 'export' para salvar.");
    this.session.active = false; this.session.step = 'idle';
  },

  readFile(fileName) {
    const fileMap = { 'quick-start.log': 'quick-start', 'attributes.bin': 'attributes', 'skills.db': 'skills', 'traits.json': 'traits', 'economy.xlsm': 'economy', 'protocols.pdf': 'protocols', 'hidden-level.enc': 'hidden-level' };
    const key = fileMap[fileName.toLowerCase()] || fileName.split('.')[0].toLowerCase();
    if (key === 'traits' && typeof Renderers !== 'undefined') { Renderers.renderTraits(); return; }
    if (key === 'skills' && typeof Renderers !== 'undefined') { Renderers.renderSkills(); return; }
    this.print(`OPENING ${fileName}...`);
    if (typeof Navigation !== 'undefined') {
      const c = Navigation.getContent(key);
      if (c) this.print(c); else this.print("Error: Data corrupted.", "error");
    }
  },

  rollDice() {
    const d = []; let t = 0;
    for(let i=0; i<4; i++){ const r = Math.floor(Math.random()*3)-1; d.push(r===1?'+':(r===-1?'-':'0')); t += r; }
    this.print(`RESULT: [${d.join(' ')}] = <span class="highlight">${t > 0 ? '+'+t : t}</span>`);
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
  }
};