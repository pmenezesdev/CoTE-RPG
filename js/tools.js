/**
 * ANHS Intelligence OS - Data Renderers
 */

const Renderers = {
  async renderTraits() {
    Terminal.print("FETCHING TRAIT_DATABASE...");
    try {
      const resp = await fetch('data/traits.json');
      const data = await resp.json();
      
      let html = `<div style="border: 1px solid var(--term-border); padding: 15px; margin: 10px 0;">`;
      html += `<h2 style="color: var(--term-red); border-bottom: 1px solid var(--term-border); margin-bottom: 10px;">[ BÊNÇÃOS ]</h2>`;
      
      for (const [category, traits] of Object.entries(data.blessings)) {
        html += `<div style="margin-top: 15px; color: var(--accent); font-size: 0.8rem;">--- ${category.toUpperCase()} ---</div>`;
        traits.forEach(t => {
          html += `<div style="margin: 5px 0;">
            <span class="highlight">${t.name}</span> <span style="font-size: 0.7rem;">(★${t.cost})</span><br>
            <span style="font-size: 0.8rem; opacity: 0.8;">${t.description}</span>
          </div>`;
        });
      }

      html += `<h2 style="color: var(--term-red); border-bottom: 1px solid var(--term-border); margin: 20px 0 10px;">[ FALHAS ]</h2>`;
      
      for (const [category, flaws] of Object.entries(data.flaws)) {
        html += `<div style="margin-top: 15px; color: var(--term-red); font-size: 0.8rem;">--- ${category.toUpperCase()} ---</div>`;
        flaws.forEach(f => {
          html += `<div style="margin: 5px 0;">
            <span class="highlight" style="background: var(--term-red);">${f.name}</span> <span style="font-size: 0.7rem;">(★${f.gain})</span><br>
            <span style="font-size: 0.8rem; opacity: 0.8;">${f.description}</span>
          </div>`;
        });
      }
      
      html += `</div>`;
      Terminal.print(html);
      Terminal.print("TRAIT_MANIFEST: Rendered successfully.");
    } catch (e) {
      Terminal.print("Error: Could not parse traits_manifest.json", "error");
      console.error(e);
    }
  },

  renderSkills() {
    const skills = Terminal.systemData.skills;
    let html = `<div style="border: 1px solid var(--term-border); padding: 15px; margin: 10px 0;">`;
    html += `<h2 style="color: var(--term-red); border-bottom: 1px solid var(--term-border); margin-bottom: 10px;">[ SKILL_DATABASE ]</h2>`;
    
    for (const [category, list] of Object.entries(skills)) {
      html += `<div style="margin-top: 10px;">
        <strong style="color: var(--accent); font-size: 0.8rem;">${category}:</strong><br>
        <span style="font-size: 0.8rem; opacity: 0.8;">${list.join(', ')}</span>
      </div>`;
    }
    
    html += `</div>`;
    Terminal.print(html);
  }
};