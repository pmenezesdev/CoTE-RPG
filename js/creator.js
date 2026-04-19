/**
 * Gerenciador de Estado do Personagem
 */
const CharacterState = {
    name: "",
    class: "D",
    attributes: {},
    skills: {},
    blessings: [],
    flaws: [],
    points: {
        attributes: 6,
        skills: 35
    },

    init() {
        FUDGE_SYSTEM.attributes.forEach(attr => {
            this.attributes[attr.id] = 3; 
        });
        this.renderAttributes();
        this.renderSkills();
        this.renderTraits();
        this.updatePointDisplay();
    },

    updateAttribute(id, delta) {
        const currentIndex = this.attributes[id];
        const newIndex = currentIndex + delta;
        if (newIndex < 0 || newIndex >= FUDGE_SYSTEM.levels.length) return;
        const currentLevelValue = FUDGE_SYSTEM.levels[currentIndex].value;
        const newLevelValue = FUDGE_SYSTEM.levels[newIndex].value;
        const cost = newLevelValue - currentLevelValue;
        if (this.points.attributes >= cost) {
            this.attributes[id] = newIndex;
            this.points.attributes -= cost;
            this.renderAttributes();
            this.updatePointDisplay();
        }
    },

    updateSkill(category, skillName, delta) {
        if (!this.skills[skillName]) this.skills[skillName] = 1; // Começa em Ruim (índice 1)
        const currentIndex = this.skills[skillName];
        const newIndex = currentIndex + delta;
        if (newIndex < 0 || newIndex >= FUDGE_SYSTEM.levels.length) return;
        
        // Custo FUDGE: Péssimo(0), Ruim(0), Medíocre(1), Mediano(2), Bom(3), Ótimo(4), Soberbo(5)
        const costTable = [1, 0, 1, 2, 3, 4, 5]; 
        const cost = delta > 0 ? costTable[newIndex] : -costTable[currentIndex];

        if (this.points.skills >= cost) {
            this.skills[skillName] = newIndex;
            this.points.skills -= cost;
            this.renderSkills();
            this.updatePointDisplay();
        }
    },

    toggleTrait(type, name) {
        const list = type === 'blessing' ? this.blessings : this.flaws;
        const index = list.indexOf(name);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(name);
        }
        this.renderTraits();
    },

    renderAttributes() {
        const container = document.getElementById('attributesContainer');
        if (!container) return;
        container.innerHTML = FUDGE_SYSTEM.attributes.map(attr => {
            const levelIndex = this.attributes[attr.id];
            const level = FUDGE_SYSTEM.levels[levelIndex];
            return `
                <div class="attr-card">
                    <div class="attr-header">
                        <span class="cinzel">${attr.icon} ${attr.name}</span>
                        <div class="fudge-control">
                            <button class="fudge-btn" onclick="CharacterState.updateAttribute('${attr.id}', -1)">-</button>
                            <span class="fudge-value primary-text">${level.name}</span>
                            <button class="fudge-btn" onclick="CharacterState.updateAttribute('${attr.id}', 1)">+</button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;
        let html = '';
        for (const [cat, skills] of Object.entries(FUDGE_SYSTEM.skills)) {
            html += `<h3 class="cinzel" style="margin: 20px 0 10px; border-bottom: 1px solid var(--primary);">${cat.toUpperCase()}</h3><div class="attributes-grid">`;
            skills.forEach(skill => {
                const levelIndex = this.skills[skill] || 1;
                const levelName = FUDGE_SYSTEM.levels[levelIndex].name;
                html += `
                    <div class="attr-card" style="padding: 10px 20px;">
                        <div class="attr-header">
                            <span>${skill}</span>
                            <div class="fudge-control">
                                <button class="fudge-btn" onclick="CharacterState.updateSkill('${cat}', '${skill}', -1)">-</button>
                                <span class="fudge-value" style="font-size: 0.8rem;">${levelName}</span>
                                <button class="fudge-btn" onclick="CharacterState.updateSkill('${cat}', '${skill}', 1)">+</button>
                            </div>
                        </div>
                    </div>`;
            });
            html += `</div>`;
        }
        container.innerHTML = html;
    },

    renderTraits() {
        const bContainer = document.getElementById('blessingsContainer');
        const fContainer = document.getElementById('flawsContainer');
        
        bContainer.innerHTML = FUDGE_SYSTEM.blessings.map(b => `
            <div class="attr-card ${this.blessings.includes(b.name) ? 'active-trait' : ''}" onclick="CharacterState.toggleTrait('blessing', '${b.name}')" style="cursor:pointer; border-left-color: gold;">
                <strong class="cinzel">${b.name}</strong>
                <p style="font-size: 0.8rem;">${b.effect}</p>
            </div>
        `).join('');

        fContainer.innerHTML = FUDGE_SYSTEM.flaws.map(f => `
            <div class="attr-card ${this.flaws.includes(f.name) ? 'active-trait' : ''}" onclick="CharacterState.toggleTrait('flaw', '${f.name}')" style="cursor:pointer; border-left-color: #333;">
                <strong class="cinzel">${f.name}</strong>
                <p style="font-size: 0.8rem;">${f.effect}</p>
            </div>
        `).join('');
    },

    updatePointDisplay() {
        document.getElementById('attrPoints').textContent = this.points.attributes;
        document.getElementById('skillPoints').textContent = this.points.skills;
    },

    generateFinalSheet() {
        const summary = document.getElementById('finalSummary');
        summary.innerHTML = `
            <div class="card-paper" id="printableSheet" style="border: 4px double var(--primary);">
                <h1 class="cinzel primary-text" style="text-align:center;">Dossiê de Estudante</h1>
                <h2 style="text-align:center; border-bottom: 1px solid #000;">${this.name}</h2>
                <div class="attributes-grid" style="margin-top:20px;">
                    <div>
                        <h3 class="cinzel">Atributos</h3>
                        ${FUDGE_SYSTEM.attributes.map(a => `<p><strong>${a.name}:</strong> ${FUDGE_SYSTEM.levels[this.attributes[a.id]].name}</p>`).join('')}
                    </div>
                    <div>
                        <h3 class="cinzel">Traços</h3>
                        <p><strong>Bênçãos:</strong> ${this.blessings.join(', ') || 'Nenhuma'}</p>
                        <p><strong>Falhas:</strong> ${this.flaws.join(', ') || 'Nenhuma'}</p>
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <h3 class="cinzel">Perícias Principais</h3>
                    <p>${Object.entries(this.skills).filter(([_, v]) => v > 3).map(([k, v]) => `${k} (${FUDGE_SYSTEM.levels[v].name})`).join(' | ')}</p>
                </div>
                <p style="margin-top:40px; text-align:center; font-family:'Cinzel'; opacity:0.5;">Tokyo Metropolitan Ironclad Academy © 2026</p>
            </div>
            <button onclick="CharacterState.exportImage()" class="btn-final">💾 SALVAR DOSSIÊ COMO IMAGEM</button>
        `;
    },

    exportImage() {
        html2canvas(document.getElementById('printableSheet')).then(canvas => {
            const link = document.createElement('a');
            link.download = `Ficha_CoTE_${this.name}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    },

    // Navegação entre capítulos
    changeStep(stepId) {
        document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
        document.getElementById(stepId).style.display = 'block';
        
        // Atualiza botões da nav
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.step === stepId);
        });

        window.scrollTo(0, 0);
    }
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // CharacterState.init(); // Será chamado após a carta de introdução
});